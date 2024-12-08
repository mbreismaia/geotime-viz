import datetime
import numpy as np

class Curve:
    def __init__(self, P, id, size_r, variables):
        self.variables = variables
        self.data = {}

        for var in self.variables:
            self.data[var] = np.zeros(P)    

        #information for scatter plot
        self.x = float(0.0)
        self.y = float(0.0)

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

        # for parallel plot
        self.ED_parallel = {}
        self.phi_parallel = {}
        self.depth_g_parallel = {}

        for var in self.variables:
            self.ED_parallel[var] = float(0.0)
            self.depth_g_parallel[var] = P * [0.0]
            self.phi_parallel[var] = size_r * [0.0]

    def to_dict_front(self):
        return {
            'variables': self.variables,
            'data': {var: [float(val) for val in val.tolist()] for var, val in self.data.items()},
            'id': self.id,
            'zone': self.zone,
            'P': self.P,
            'date': self.date.isoformat(),
            'weekDay': self.weekDay,
            'depth_g': [float(d) for d in self.depth_g],
            'ED_parallel': {var: float(val) for var, val in self.ED_parallel.items()},
            'x': float(self.x),
            'y': float(self.y),
        }

    def to_dict(self):
        return {
            'variables': self.variables,
            'data': {var: [float(val) for val in val.tolist()] for var, val in self.data.items()},
            'id': self.id,
            'zone': self.zone,
            'P': self.P,
            'date': self.date.isoformat(),
            'weekDay': self.weekDay,
            'depth_g': [float(d) for d in self.depth_g],
            'ED_parallel': {var: float(val) for var, val in self.ED_parallel.items()},
            'x': float(self.x),
            'y': float(self.y),
            'phi': [float(p) for p in self.phi],
            'extremal_depth': float(self.extremal_depth),
            'phi_parallel': {var: [float(p) for p in val] for var, val in self.phi_parallel.items()},
            'depth_g_parallel': {var: [float(d) for d in val] for var, val in self.depth_g_parallel.items()},
        }
    
    def from_dict(data):
        curve = Curve(data['P'], data['id'], data['zone'], data['variables'])
        curve.data = {var: np.array(val) for var, val in data['data'].items()}
        curve.date = datetime.datetime.fromisoformat(data['date'])
        curve.depth_g = data['depth_g']
        curve.weekDay = data['weekDay']
        curve.ED_parallel = data['ED_parallel']
        curve.x = data['x']
        curve.y = data['y']
        curve.phi = data['phi']
        curve.extremal_depth = data['extremal_depth']
        curve.phi_parallel = data['phi_parallel']
        curve.depth_g_parallel = data['depth_g_parallel']
        
        return curve