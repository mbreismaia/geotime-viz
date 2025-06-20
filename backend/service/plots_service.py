from collections import defaultdict
from datetime import date, datetime, timedelta

import numpy as np
import pandas as pd
import umap.umap_ as umap
from sklearn.manifold import TSNE

from .ED import ED, ED_parallel
from .curve import Curve
from schemas.queryED import QueryED
from schemas.parameters import Parameters
from sqlalchemy.orm import Session
from sqlalchemy import text

from api.database import SessionLocal
from api.models import CurveModel

from api.database_frontend import SessionLocalFrontend
from api.models_frontend import CurveFrontendModel

from api.database_map import SessionLocalMap
from api.models_map import MapModel

class PlotService:
    @staticmethod
    def getHour(num):
        hour = num // 2
        minute = (num % 2) * 30
        return f"{hour:02d}:{minute:02d}"
    
    ####################################################################################################################
    
    @staticmethod
    def get_all_curves():
        db: Session = SessionLocal()
        try:
            return db.query(CurveModel).all()
        finally:
            db.close()

    ####################################################################################################################

    @staticmethod
    def convert_zone_name_to_id(zone_name):
        """
        Converte o nome da zona para o ID correspondente.
        """
        db: Session = SessionLocalMap()
        try:
            zone = db.query(MapModel).filter(MapModel.zone_name == zone_name).first()
            if zone:
                return zone.zone
            else:
                raise ValueError(f"Zone name '{zone_name}' not found in the database.")
        finally:
            db.close()

    ####################################################################################################################
    
    @staticmethod
    def get_min_max_dates(db):
        result = db.execute(text("""
            SELECT MIN(date) as min_date, MAX(date) as max_date
            FROM curves
        """)).fetchone()

        min_date = datetime.strptime(result.min_date, "%Y-%m-%d") if isinstance(result.min_date, str) else result.min_date
        max_date = datetime.strptime(result.max_date, "%Y-%m-%d") if isinstance(result.max_date, str) else result.max_date

        return {
            "min_date": min_date.isoformat() if min_date else None,
            "max_date": max_date.isoformat() if max_date else None
        }

    ####################################################################################################################

    @staticmethod
    def get_all_zones():
        """
        Recupera todas as zonas disponíveis no banco de dados.
        """
        db: Session = SessionLocal()
        try:
            zones = db.query(CurveModel.zone).distinct().all()
            return [zone[0] for zone in zones]
        finally:
            db.close()

    ####################################################################################################################
    
    @staticmethod
    def save_curves_to_db(curves):
        print("Saving curves to database")
        db: Session = SessionLocal()
        try:            
            for curve in curves:
                # print("curve_zone: ",  curve.zone, "curve_zone_type: ", type(curve.zone))
                curve_model = CurveModel(
                    zone=int(curve.zone),
                    zone_name=curve.zone_name,
                    id=curve.id,
                    date=curve.date,
                    week_day=curve.weekDay,
                    data=curve.to_dict()
                )
                db.add(curve_model)
            db.commit()
            print("Curves saved to database")
        except Exception as e:
            db.rollback()
            print(f"Error saving curves: {e}")
            raise
        finally:
            db.close()

    ####################################################################################################################

    @staticmethod
    def save_curves_to_frontend_db(curves):
        print("Saving curves to frontend database")
        db: Session = SessionLocalFrontend()
        try:
            # Step 1: Clear the table
            db.query(CurveFrontendModel).delete()
            db.commit()
            print("Frontend DB cleared")

            # Step 2: Insert new curves
            for curve in curves:
                curve_model = CurveFrontendModel(
                    id=curve.id,
                    date=curve.date,
                    zone=curve.zone,
                    zone_name=curve.zone_name,
                    week_day=curve.weekDay,
                    data=curve.to_dict()
                )
                db.add(curve_model)

            db.commit()
            print("Curves saved to frontend database")

        except Exception as e:
            db.rollback()
            print(f"Error saving curves to frontend DB: {e}")
            raise
        finally:
            db.close()

    ####################################################################################################################

    @staticmethod
    def save_curves_to_map_db(curves):
        print("Saving curves to map database")
        db: Session = SessionLocalMap()
        try:
            # Step 1: Clear the table
            db.query(MapModel).delete()
            db.commit()
            print("Map DB cleared")

            # Step 2: Insert new curves
            for curve in curves:
                curve_model = MapModel(
                    zone=curve.zone,
                    zone_name=curve.zone_name,
                    ED=curve.extremal_depth,
                    amount_of_flights=curve.data['values'].sum() if 'values' in curve.data else 0,
                )
                db.add(curve_model)

            db.commit()
            print("Curves saved to map database")

        except Exception as e:
            db.rollback()
            print(f"Error saving curves to map DB: {e}")
            raise
        finally:
            db.close()


    ####################################################################################################################

    @staticmethod
    def read_data_from_frontend_db(db: Session, parameters: Parameters):
        """
        Recupera os dados da tabela CurveFrontendModel filtrando pela zona e weekday.
        """
        if not parameters.zones:
            print("Reading all data from DB (no zones specified)")
            records = db.query(CurveFrontendModel).all()
        else:
            print(f"Reading data from DB for zones {parameters.zones} db frontend")
            records = (
                db.query(CurveFrontendModel)
                .filter(CurveFrontendModel.zone.in_(parameters.zones))
                .filter(CurveFrontendModel.week_day.in_(parameters.days_of_week))
                .all()
            )

        if not records:
            raise ValueError(f"No data found in DB for zones {parameters.zones}")
        
        print(f"Found {len(records)} records in DB for zones")

        C = []
        for record in records:
            C.append(Curve.from_dict(record.data))

        return C

    ####################################################################################################################

    @staticmethod
    def read_data_from_db(db: Session, parameters: Parameters):
        """
        Recupera os dados da tabela CurveModel filtrando pela zona.
        """
        print(f"Reading data from DB for zones {parameters.zones} db")

        if not parameters.zones:
            # Get all records if no specific zone or hour interval is provided
            print("No specific zones provided, retrieving all records")
            records = db.query(CurveModel).all()
        else:
            zones = [int(z) for z in parameters.zones]
            parameters.zones = zones  # Store the converted zones back in parameters
            for zone in parameters.zones:
                if not isinstance(zone, int):
                    raise ValueError(f"Zone {zone} is not a valid integer ID")
            records = (
                db.query(CurveModel)
                .filter(CurveModel.zone.in_(parameters.zones))
                .filter(CurveModel.week_day.in_(parameters.days_of_week))
                .all()
            )

        if not records:
            raise ValueError(f"No data found in DB for zones {parameters.zones}")
        
        print(f"Found {len(records)} records in DB for zones")

        C = []
        for record in records:
            C.append(Curve.from_dict(record.data))

        return C
    
    ####################################################################################################################

    @staticmethod
    def read_data_from_map_db(db: Session):
        """
        Recupera os dados da tabela MapModel.
        """
        records = db.query(MapModel).all()

        if not records:
            raise ValueError(f"No data found in DB map")
        
        print(f"Found {len(records)} records in DB map")

        df = pd.DataFrame([{
            'zone': record.zone,
            'zone_name': record.zone_name,
            'ED': record.ED,
            'amount_of_flights': record.amount_of_flights,
        } for record in records])

        return df

    ####################################################################################################################

    @staticmethod
    def group_curves_by_key(curves, key: str):
        """
        Aggregates curves by the specified attribute key (e.g., 'date' or 'zone').

        Parameters:
        - curves: list of Curve objects
        - key: attribute name to group by, e.g., 'date' or 'zone'

        Returns:
        - List of aggregated Curve objects
        """
        grouped_curves = defaultdict(list)
        for curve in curves:
            group_key = getattr(curve, key)
            grouped_curves[group_key].append(curve)

        aggregated_curves = []

        for group_key, curve_list in grouped_curves.items():
            if not curve_list:
                continue

            P = curve_list[0].P
            variables = curve_list[0].variables
            new_curve = Curve(P, curve_list[0].id, 100, variables=variables)

            # Preencher campos extras com base no primeiro da lista
            new_curve.date = curve_list[0].date
            new_curve.weekDay = curve_list[0].weekDay
            new_curve.zone = curve_list[0].zone
            new_curve.zone_name = curve_list[0].zone_name or "Aggregated"

            # Se agregando por zona, mude o nome da zona
            if key == "zone":
                new_curve.zone = group_key
            elif key == "date":
                new_curve.date = group_key

            aggregated_result = {}
            for var in variables:
                valores = []
                pesos = []

                for c in curve_list:
                    if var in c.data and 'values' in c.data:
                        var_data = np.array(c.data[var])
                        value_data = np.array(c.data['values'])

                        if len(var_data) >= P and len(value_data) >= P:
                            valores.append(var_data[:P])
                            pesos.append(value_data[:P])

                if valores and pesos:
                    valores = np.stack(valores)      # (n_curves, P)
                    pesos = np.stack(pesos)          # (n_curves, P)
                    numerador = np.sum(valores * pesos, axis=0)
                    denominador = np.sum(pesos, axis=0)

                    with np.errstate(divide='ignore', invalid='ignore'):
                        aggregated_data = np.divide(numerador, denominador)
                        aggregated_data[np.isnan(aggregated_data)] = 0.0

                    aggregated_result[var] = aggregated_data

            # Calcular a soma total dos pesos (values)
            all_values = [
                np.array(c.data['values'][:P])
                for c in curve_list if 'values' in c.data and len(c.data['values']) >= P
            ]
            if all_values:
                aggregated_result['values'] = np.sum(np.stack(all_values), axis=0)
            else:
                aggregated_result['values'] = np.zeros(P)

            new_curve.data = aggregated_result
            aggregated_curves.append(new_curve)

        return aggregated_curves

    ####################################################################################################################

    @staticmethod
    def calculateEDForZone(parameters: Parameters):
        if parameters.zones:
            parameters.zones = PlotService.zone_conversion(parameters.zones)

        print("Reading data from database")
        with SessionLocal() as db:
            C = PlotService.read_data_from_db(db, parameters)
        print("Data read from database")
        print("Number of curves read from database:", len(C))

        # Agrupar curvas por zone
        print("Grouping curves by zone")
        C = PlotService.group_curves_by_key(C, 'zone')
        print(f"Curves grouped by zone, number of groups: {len(C)}")

        # Calcular ED
        query = QueryED(
            r = [(i + 1) / 100 for i in range(100)],
            depth_type = parameters.depth_type,
            variables = parameters.variables,
            zones= parameters.zones,
            hour_interval = parameters.hour_interval
        )

        print("Calculating ED")
        C = ED(C, query)
        print("ED calculated")

        # Salvar os dados no database
        PlotService.save_curves_to_map_db(C)

    ####################################################################################################################

    @staticmethod
    def zone_conversion(zones):
        """
        Converte os nomes das zonas para IDs.
        """
        converted_zones = []
        for zone in zones:
            if isinstance(zone, str) and not zone.isdigit():
                try:
                    converted_zone = PlotService.convert_zone_name_to_id(zone)
                    converted_zones.append(str(converted_zone))
                except ValueError as e:
                    print(f"Erro ao converter zona: {e}")
                    continue
            else:
                converted_zones.append(zone)
        return converted_zones

    @staticmethod 
    def computeED(parameters: Parameters):
        print("Starting ED computation function")
        r = []
        for i in range(100):
            r.append((i + 1) / 100)

        if parameters.zones:
            parameters.zones = PlotService.zone_conversion(parameters.zones)
            print("Parameters after zone conversion:", parameters.zones)

        query = QueryED(
            r = r,
            depth_type = parameters.depth_type,
            variables = parameters.variables,
            zones= parameters.zones,
            hour_interval = parameters.hour_interval
        )

        print("Reading data from database")
        with SessionLocal() as db:
            C = PlotService.read_data_from_db(db, parameters)
        print("Data read from database")

        print("Number of curves read from database:", len(C))

        print("Grouping curves by date")
        C = PlotService.group_curves_by_key(C, 'date')
        print("Curves grouped by date")

        print("Number of curves after grouping by date:", len(C))

        print("Calculating ED")
        C = ED(C, query)
        print("ED calculated")

        print("Calculating ED parallel")
        C = ED_parallel(C, query)
        print("ED parallel calculated")

        # Salvar os dados no database
        print("Saving data to database")
        PlotService.save_curves_to_frontend_db(C)
        print("Data saved to database")

    ####################################################################################################################
    
    @staticmethod
    def calculateScatter(parameters: Parameters):
        print("Calculating scatter data")
        technique = parameters.dim_reduction_technique

        print("Reading data from database for scatter plot")
        with SessionLocalFrontend() as db:
            C = PlotService.read_data_from_frontend_db(db, parameters)

        print("Data read from database for scatter plot")
        print("Number of curves read from database for scatter plot:", len(C))

         
        if technique == "UMAP":
            model = umap.UMAP(n_components = 2, n_neighbors = min(len(C) - 2, 30), min_dist = 0.1)
        else:
            model = TSNE(n_components = 2, perplexity = min(len(C) - 2, 30), learning_rate = 100)
        
        X = []
        for curve in C:
            X.append(curve.depth_g)

        X = np.array(X)
        y = model.fit_transform(X)

        for i, curve in enumerate(C):
            curve.x = y[i, 0]
            curve.y = y[i, 1]

        print("Scatter data calculated")

        # Salvar os dados no database
        print("Saving scatter data to database")
        PlotService.save_curves_to_frontend_db(C)
        print("Scatter data saved to database")
    
    ####################################################################################################################
    
    @staticmethod
    def get_plot_data(parameters: Parameters):
        print("Getting plot data")
        
        PlotService.computeED(parameters)
        PlotService.calculateEDForZone(parameters)

        PlotService.calculateScatter(parameters)
        print("Plot data retrieved")