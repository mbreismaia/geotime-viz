# depth_functions.py
import numpy as np

def L2_depth(x, data):
    cov=np.cov(np.transpose(data))

    if np.sum(np.isnan(cov))==0:
        sigma=np.linalg.inv(cov)
    else:
        print("Covariance estimate not found, no affine-invariance-adjustment")
        sigma=np.eye(len(data))

    depths=(-1)*np.ones(len(x))
    for i in range(len(x)):
        tmp1=(x[i]-data)
        tmp2=np.matmul(tmp1,sigma)
        tmp3=np.sum(tmp2 * tmp1,axis=1)
        depths[i]=1/(1 + np.mean(np.sqrt(tmp3)))
    return depths

def mahalanobis_depth(X, Y, cov_inv):
    """Calcula a profundidade de Mahalanobis usando numpy."""
    diff = X[:, np.newaxis] - Y
    return np.sqrt(np.sum(np.dot(diff, cov_inv) * diff, axis=2))

def halfspace_depth(X, Y):
    """Calcula a profundidade de halfspace com numpy."""
    depths = []
    for i in range(len(X)):
        point = X[i]
        count = 0
        for j in range(len(Y)):
            if np.dot(Y[j] - point, point) >= 0:
                count += 1
        depths.append(count / len(Y))
    return np.array(depths)

def spatial_depth(X, Y):
    """Calcula a profundidade espacial usando numpy."""
    depths = []
    for i in range(len(X)):
        point = X[i]
        count = 0
        for j in range(len(Y)):
            if np.linalg.norm(Y[j] - point) < np.linalg.norm(Y[i] - point):
                count += 1
        depths.append(count / len(Y))
    return np.array(depths)

def compute_cov_inv(X):
    """Calcula a inversa da matriz de covariância usando numpy."""
    cov_matrix = np.cov(X, rowvar=False)
    cov_inv = np.linalg.inv(cov_matrix)
    return cov_inv
