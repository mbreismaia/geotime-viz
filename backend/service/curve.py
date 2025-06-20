import datetime
import numpy as np

class Curve:
    def __init__(self, P, id, size_r, variables):
        self.variables = variables
        self.data = {}

        for var in self.variables:
            self.data[var] = np.zeros(P)
        
        # adding the 'values' variable to store the count of values
        self.data['values'] = np.zeros(P)    

        #information for scatter plot
        self.x = float(0.0)
        self.y = float(0.0)

        #curves info
        self.P = int(P)
        self.id = int(id)
        self.zone = int(0)
        self.zone_name = ''
        self.weekDay = int(0)
        self.date = datetime.datetime(2020, 1, 1)

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

        # Initialize ED_parallel and depth_g_parallel for 'values'
        self.ED_parallel['values'] = float(0.0)
        self.depth_g_parallel['values'] = P * [0.0]
        self.phi_parallel['values'] = size_r * [0.0]

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
            'zone_name': self.zone_name,
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
        curve = Curve(data['P'], data['id'], 100, data['variables'])
        curve.zone = data['zone']
        curve.zone_name = data['zone_name']
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