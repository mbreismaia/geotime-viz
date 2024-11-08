# depth_functions.py
import numpy as np

def L2_depth(X, Y):
    """Calcula a profundidade L2 (distância Euclidiana) usando apenas numpy."""
    return np.linalg.norm(X[:, np.newaxis] - Y, axis=2)

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
