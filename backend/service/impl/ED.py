from service.impl.quicksort import quicksort
import numpy as np
from depth.multivariate import *
from backend.schemas.queryED import QueryED

def calculatePointwiseDepth(C, variables, pos, depth_type='L2'):
    data = []
    for i in range(len(C)):
        list = [C[i].data[variables[j]][pos] for j in range(variables)]
        data.append(np.array(list))

    data = np.array(data)

    depths = []
    if depth_type == 'L2':
        depths = L2(data, data)
    elif depth_type == 'Spatial':
        depths = spatial(data, data)
    elif depth_type == 'mahalanobis':
        depths = mahalanobis(data, data)
    else:
        depths = halfspace(data, data)

    for i in range(len(C)):
        C[i].depth_g[pos] = depths[i]

    return 

def ED(C, query: QueryED):

    N = len(C)                                       # amount of data
    P = len(C[0].P)                                  # resolution of data

    r = query.r
    r_size = len(query.r)                            # Auxiliary vector used by extremal depth
    depth_type = query.depth_type                    # type of depth being used
    variables = len(query.variables)                 # amount of variables being analyzed
    leftHour, rightHour = query.hour_interval        # interval of hours being analyzed

    print("N: ", N)
    print("P: ", P)
    print("variables: ", variables)

    if variables == 1:
        variable = query.variables[0]
        print("is univariate")
        for g in range(N):
            for t in range(leftHour, rightHour + 1):
                for f in range(N):
                    if C[f].data[variable][t] < C[g].data[variable][t]:
                        C[g].depth_g[t] += 1.0
                    if C[f].data[variable][t] > C[g].data[variable][t]:
                        C[g].depth_g[t] -= 1.0
                C[g].depth_g[t] = 1 - (abs(C[g].depth_g[t]) / N)
    else:
        print("is multivariate")
        for t in range(leftHour, rightHour + 1):
            calculatePointwiseDepth(C, variables, t, depth_type)
 
    for g in range(N):
        for rr in range(r_size):
            cnt = 0
            for t in range(leftHour, rightHour + 1):
                if C[g].depth_g[t] <= r[rr]:
                    cnt += 1
            C[g].phi[rr] = cnt / (rightHour - leftHour + 1)

    # order functions
    quicksort(C, 0, N - 1)

    for i in range(N):
        L = 0
        R = N - 1
        while L <= R:
            mid = (L + R) // 2
            if cmp(C[i], C[mid]):
                R = mid - 1
            else:
                L = mid + 1

        C[i].extremal_depth = L / N

    C = C[::-1]

    return 
