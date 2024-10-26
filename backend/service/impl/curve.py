import datetime
import numpy as np

class Curve:
    def __init__(self, P, id, size_r, variables):
        self.variables = variables
        self.data = {}

        for var in self.variables:
            self.data[var] = np.zeros(P)    

        #curves info
        self.P = int(P)
        self.id = int(id)
        self.zone = int(0)
        self.weekDay = int(0)
        self.date = datetime.datetime(2012, 1, 1)

        #for values
        self.phi = size_r * [0.0]                                        #por enquanto, 4 eh o padrao
        self.depth_g = P * [0.0]
        self.extremal_depth = float(0.0)


    def to_dict(self):
        return {
            'variables': self.variables,
            'values': {var: val.tolist() for var, val in self.values.items()},
            'id': self.id,
            'zone': self.zone,
            'P': self.P,
            'date': self.date.isoformat(), 
            'weekDay': self.weekDay
        }
    
    def from_dict(data):
        curve = Curve(data['P'], data['id'], data['zone'], data['variables'])
        curve.data = {var: np.array(val) for var, val in data['values'].items()}
        curve.date = datetime.datetime.fromisoformat(data['date'])
        curve.weekDay = data['weekDay']
        return curve