from quicksort import *
import time
import numpy as np
from depth.multivariate import *

def calculatePointwiseDepth(C, Dim, pos, depthType='L2'):
    data = []
    for i in range(len(C)):
        list = [C[i][pos][j] for j in range(Dim)]
        data.append(np.array(list))

    data = np.array(data)

    depths = []
    if depthType == 'L2':
        depths = L2(data, data)
    elif depthType == 'Spatial':
        depths = spatial(data, data)
    elif depthType == 'mahalanobis':
        depths = mahalanobis(data, data)
    else:
        depths = halfspace(data, data)

    return depths

def ED(C, r):
    # Auxiliary vector used by extremal depth
    r_size = len(r)

    N = len(C)                      # amount of data
    P = len(C[0])                   # resolution of data
    variables = len(C[0][0])        # amount of variables being analyzed

    print("N: ", N)
    print("P: ", P)
    print("variables: ", variables)

    DepthG = np.zeros((N, P))       # depth of each function
    phi = np.zeros((N, r_size))     # phi value of each function
    extremalDepth = np.zeros(N)    # extremal depth of each function

    if variables == 1:
        for g in range(N):
            for t in range(P):
                for f in range(N):
                    if C[f][t] < C[g][t]:
                        DepthG[g][t] += 1.0
                    if C[f][t] > C[g][t]:
                        DepthG[g][t] -= 1.0
                DepthG[g][t][t] = 1 - (abs(DepthG[g][t]) / N)
            tt = time.time() - tt
            C[g].extremal_depth_time += tt
    else:
        print("is multivariate")
        for t in range(P):
            depths = calculatePointwiseDepth(C, variables, t)
            for i in range(len(C)):
                DepthG[i][t] = depths[i]
 
    for g in range(N):
        for rr in range(r_size):
            cnt = 0
            for t in range(P):
                if DepthG[g][t] <= r[rr]:
                    cnt += 1
            phi[g][rr] = cnt / P
    
    # order functions
    quicksort(C, phi, 0, N - 1)

    for i in range(N):
        L = 0
        R = N - 1
        while L <= R:
            mid = (L + R) // 2
            if cmp(i, mid, phi):
                R = mid - 1
            else:
                L = mid + 1

        extremalDepth[i] = L / N

    C = C[::-1]

    return DepthG, phi, extremalDepth