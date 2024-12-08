# Importando as funções de profundidade
from service.impl.quicksort import quicksort
from service.impl.quicksort import cmp
import numpy as np
from schemas.queryED import QueryED
from service.impl.depth_functions import L2_depth, mahalanobis_depth, halfspace_depth, spatial_depth

def calculatePointwiseDepth(C, variables, pos, depth_type='L2'):
    data = []
    for i in range(len(C)):
        data.append([C[i].data["prices"][pos], C[i].data["values"][pos], C[i].data["total_time"][pos], C[i].data["distances"][pos]])

    data = np.array(data)
    depths = []
    if depth_type == 'L2':
        depths = L2_depth(data, data)
    elif depth_type == 'Spatial':
        depths = spatial_depth(data, data)
    elif depth_type == 'mahalanobis':
        cov_inv = np.linalg.inv(np.cov(data.T))
        depths = mahalanobis_depth(data, data, cov_inv)
    else:
        depths = halfspace_depth(data, data)
    
    for i in range(len(C)):
        C[i].depth_g[pos] = depths[i]

    return C

def ED(C, query: QueryED):
    N = len(C)                                       # amount of data
    P = C[0].P                                       # resolution of data

    r = query.r
    r_size = len(query.r)                            # Auxiliary vector used by extremal depth
    depth_type = query.depth_type                    # type of depth being used
    variables = query.variables                       # variables being analyzed
    len_variables = len(query.variables)                 # amount of variables being analyzed
    leftHour, rightHour = query.hour_interval        # interval of hours being analyzed

    print("N: ", N)
    print("P: ", P)
    print("variables: ", variables)

    if len_variables == 1:
        variable = variables[0]
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
            C = calculatePointwiseDepth(C, variables, t, depth_type)

    for g in range(N):
        for rr in range(r_size):
            cnt = 0
            for t in range(leftHour, rightHour + 1):
                if C[g].depth_g[t] <= r[rr]:
                    cnt += 1
            C[g].phi[rr] = cnt / (rightHour - leftHour + 1)

    # order functions
    print("Sorting")
    quicksort(C, 0, N - 1)
    print("Sorted")

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

    return C

def ED_parallel(C, query: QueryED):   
    N = len(C)                                       # amount of data
    P = C[0].P                                       # resolution of data

    r = query.r
    r_size = len(query.r)                            # Auxiliary vector used by extremal depth
    variables = query.variables                      # variables being analyzed
    leftHour, rightHour = query.hour_interval        # interval of hours being analyzed

    for i in range(N):
        for j in range(P):
            for var in variables:
                C[i].depth_g_parallel[var][j] = 0.0

    for g in range(N):
        for t in range(leftHour, rightHour + 1):
            for f in range(N):
                for var in variables:
                    if C[f].data[var][t] < C[g].data[var][t]:
                        C[g].depth_g_parallel[var][t] += 1.0

                    if C[f].data[var][t] > C[g].data[var][t]:
                        C[g].depth_g_parallel[var][t] -= 1.0
            
            for var in variables:
                C[g].depth_g_parallel[var][t] = 1 - (abs(C[g].depth_g_parallel[var][t]) / N)

    for g in range(N):
        for rr in range(r_size):
            for var in variables:
                cnt = 0
                for t in range(leftHour, rightHour):
                    if C[g].depth_g_parallel[var][t] <= r[rr]:
                        cnt += 1
                C[g].phi_parallel[var][rr] = cnt / (rightHour - leftHour + 1)

    values = {}
    for var in variables:
        values[var] = []

    for i in range(N):
        for var in variables:
            values[var].append((C[i].phi_parallel[var], C[i].id))

    for var in variables:
        values[var].sort()
        values[var] = values[var][::-1]

    for var in variables:
        for i in range(N):
            id = values[var][i][1]
            for j in range(N):
                if C[j].id == id:
                    C[j].ED_parallel[var] = i / N
                    break    

    return C
