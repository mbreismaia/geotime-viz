import json
from service.impl.ED import ED, ED_parallel
import numpy as np
import pandas as pd
from datetime import *
from service.impl.curve import Curve
import umap.umap_ as umap
from sklearn.manifold import TSNE
from schemas.queryED import QueryED
from schemas.parameters import Parameters
import geojson

class PlotService:
    @staticmethod
    def getDate(num):
        year = 2012
        dt = date(year, 1, 1) + timedelta(num - 1)
        day = dt.weekday()
        month = dt.month
        return (dt, day, month)
    
    # Funcao para ser chamada no começo quando a aplicação é rodada pela primeira vez para ler os dados
    @staticmethod
    def read_data_initial():
        print("Reading data")
        curves = pd.read_csv('./db/curvesWithLocationOrigin.csv')

        N = 366
        P = 24
        R = 100
        Z = 266          #amount of zones

        variables = ['values', 'prices', 'distances', 'total_time']

        C = []                                       
        for i in range(N):
            C.append(Curve(P, i, R, variables))

        matrixes = {}
        for var in variables:
            matrixes[var] = np.empty((Z, N), dtype = object)

        for i in range(len(curves)):
            id, zone = curves.at[i, 'id'], curves.at[i, 'zone']
            for var in variables:
                val = np.array(list(map(float, curves.at[i, var][1:-1].split(', '))))
                matrixes[var][zone][id] = val

        for i in range(N):
            for j in range(Z):
                C[i].data['values'] += matrixes['values'][j][i]
                for k in range(P):
                    for var in variables:
                        if var == 'values':
                            continue
                        C[i].data[var][k] += matrixes['values'][j][i][k]*matrixes[var][j][i][k]              

            C[i].date, C[i].weekDay, C[i].month = PlotService.getDate(i + 1)

        for i in range(N):
            for j in range(P):
                for var in variables:
                    if var == 'values':
                        continue
                    if C[i].data['values'][j] != 0:
                        C[i].data[var][j] /= C[i].data['values'][j]

        # salvar os dados no json
        print("Saving data to json")
        with open('./db/database.json', 'w') as file:
            curve_data = {
                "data_read": "True",
                "curves": [curve.to_dict() for curve in C]
            }
            json.dump(curve_data, file, indent=4)

    @staticmethod
    def read_data(parameters: Parameters):
        # ler os dados do json
        with open('./db/database.json') as json_file:
            curve_data = json.load(json_file)

        print("Consegui abrir o arquivo do db")
        
        if curve_data["data_read"] == "False":
            PlotService.read_data_initial()
        else:
            print("Data already read")

        print("Going to filter the data based on date_interval and days_of_week")

        # filtrar os dados de acordo com os parametros date_interval e days_of_week
        C = []
        with open('./db/database.json') as json_file:
            curve_data = json.load(json_file)
            for curve in curve_data["curves"]:
                date = datetime.strptime(curve["date"], "%Y-%m-%d")
                if date >= datetime.strptime(parameters.date_interval[0], "%Y-%m-%d") and date <= datetime.strptime(parameters.date_interval[1], "%Y-%m-%d"):
                    if date.strftime("%A") in parameters.days_of_week:
                        C.append(Curve.from_dict(curve))
        return C

    @staticmethod 
    def computeED(parameters: Parameters):
        r = []
        for i in range(100):
            r.append((i + 1) / 100)

        query = QueryED(
            r = r,
            depth_type = parameters.depth_type,
            variables = parameters.variables,
            hour_interval = parameters.hour_interval
        )

        C = PlotService.read_data(parameters)

        print("Calculating ED")
        C = ED(C, query)
        print("ED calculated")

        print("Calculating ED parallel")
        C = ED_parallel(C, query)
        print("ED parallel calculated")
        
        return C
    
    @staticmethod
    def transformToJson(C):
        print("Transforming to json")
        data = {"data": []}
        for curve in C:
            data['data'].append(curve.to_dict_front())

        print("Transformed to json")
        return data
    
    @staticmethod
    def calculateScatter(C, parameters: Parameters):
        technique = parameters.dim_reduction_technique
         
        if technique == "UMAP":
            model = umap.UMAP(n_components = 2, n_neighbors = 30, min_dist = 0.1, random_state=0)
        else:
            model = TSNE(n_components = 2, perplexity = 30, learning_rate = 100, random_state = 0)
        
        X = []
        for curve in C:
            X.append(curve.depth_g)

        X = np.array(X)
        y = model.fit_transform(X)

        for i, curve in enumerate(C):
            curve.x = y[i, 0]
            curve.y = y[i, 1]

        return C
    
    @staticmethod
    def get_plot_data(plot_type: str,parameters: Parameters):
        print("Getting plot data")
        if parameters.runED:
            C = PlotService.computeED(parameters)
        else:
            C = PlotService.read_data(parameters)

        C = PlotService.calculateScatter(C, parameters)
        data = PlotService.transformToJson(C)

        return data