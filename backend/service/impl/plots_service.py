import json
from service.impl.ED import ED
import numpy as np
import pandas as pd
from datetime import *
from service.impl.curve import Curve
import umap.umap_ as umap
from sklearn.manifold import TSNE
from schemas.queryED import QueryED
from schemas.parameters import Parameters

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
        curves = pd.read_csv('./backend/db/curvesWithLocationOrigin.csv')

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
        with open('./backend/db/database.json', 'w') as file:
            curve_data = {
                "data_read": "True",
                "curves": [curve.to_dict() for curve in C]
            }
            json.dump(curve_data, file, indent=4)

    @staticmethod
    def read_data(parameters: Parameters):
        # ler os dados do json
        with open('./backend/db/database.json') as json_file:
            curve_data = json.load(json_file)
        
        if curve_data["data_read"] == "False":
            PlotService.read_data_initial()
        else:
            print("Data already read")


        # filtrar os dados de acordo com os parametros date_interval e days_of_week
        C = []
        with open('./backend/db/database.json') as json_file:
            curve_data = json.load(json_file)
            for curve in curve_data["curves"]:
                date = datetime.strptime(curve["date"], "%Y-%m-%d")
                if date >= datetime.strptime(parameters.date_interval[0], "%Y-%m-%d") and date <= datetime.strptime(parameters.date_interval[1], "%Y-%m-%d"):
                    if date.weekday() in parameters.days_of_week:
                        C.append(Curve.from_dict(curve))
        return C

    @staticmethod 
    def computeED(parameters: Parameters):
        r = [0.1, 0.2, 0.3, 0.4, 0.5]

        query = QueryED(
            r = r,
            depthType = parameters.depth_type,
            variables = parameters.variables,
            hour_interval = parameters.hour_interval
        )

        C = PlotService.read_data(parameters)

        ED(C, query)

        # TODO: falta salvar no database   

        return C
    
    @staticmethod
    def transformToDataFrame(C):
        data = []
        cols = ['values', 'prices', 'distances', 'total_time', 'depth_g', 'extremal_depth', 'weekDay', 'id', 'date']
        for curve in C:
            data.append((curve.data['values'],
                        curve.data['prices'],
                        curve.data['distances'],
                        curve.data['total_time'],
                        curve.depth_g,
                        curve.extremal_depth, 
                        curve.weekDay,
                        curve.id,
                        curve.date))

        df = pd.DataFrame(data, columns=cols)
        return df
    
    @staticmethod
    def calculateScatter(data, parameters: Parameters):
        technique = parameters.dim_reduction_technique
         
        if technique == "UMAP":
            model = umap.UMAP(n_components = 2, n_neighbors = 30, min_dist = 0.1, random_state=0)
        else:
            model = TSNE(n_components = 2, perplexity = 30, learning_rate = 100, random_state = 0)
        
        X = []
        for i in range(len(data)):
            X.append(data.at[i, 'depth_g'])

        X = np.array(X)
        y = model.fit_transform(X)

        df = pd.DataFrame({'x': y[:, 0], 'y':  y[:, 1], 'id': data['id'], 'weekDay': data['weekDay']})

        return df
    
    @staticmethod
    def get_plot_data(parameters: Parameters):
        if parameters.runED:
            C = PlotService.computeED(parameters)
        else:
            C = PlotService.read_data(parameters)
        
        data = PlotService.transformToDataFrame(C)
    
        if parameters.plot == "scatter":
            return PlotService.calculateScatter(parameters)
        else:
            return data

if __name__ == "__main__":
    PlotService.read_data()
    # PlotService.computeED()
