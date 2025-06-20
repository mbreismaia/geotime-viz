# depth_functions.py
import numpy as np

def L2_depth(x, data):
    # Calcula a matriz de covariância
    cov = np.cov(np.transpose(data))

    if np.sum(np.isnan(cov)) == 0:
        det = np.linalg.det(cov)
        
        if det == 0 or det < 1e-8:  
            epsilon = 1e-8 
            cov += np.eye(cov.shape[0]) * epsilon
        
        sigma = np.linalg.inv(cov)
    else:
        sigma = np.eye(data.shape[1])

    # Calcula as profundidades
    depths = (-1) * np.ones(len(x))
    for i in range(len(x)):
        tmp1 = (x[i] - data)
        tmp2 = np.matmul(tmp1, sigma)
        tmp3 = np.sum(tmp2 * tmp1, axis=1)
        depths[i] = 1 / (1 + np.mean(np.sqrt(tmp3)))

    return depths

def spatial_depth(x, data):
    depths_tab=[]
    cov=np.cov(np.transpose(data))

    if np.sum(np.isnan(cov))==0:
        w,v=np.linalg.eig(cov)
        lambda1=np.linalg.inv(np.matmul(v,np.diag(np.sqrt(w))))
    else:
        lambda1=np.eye(data.shape[1])

    depths=np.repeat(-1,len(x),axis=0)
    for i in range(len(x)):
        interm=[]
        tmp1_ter=np.transpose(x[i]-data)
        tmp1=np.transpose(np.matmul(lambda1,tmp1_ter))
        tmp1_bis=np.sum(tmp1,axis=1)
        for elements in tmp1_bis:
            if elements==0:
                interm.append(False)
            if elements!=0:
                interm.append(True)
        
        interm=np.array(interm)
        tmp1=tmp1[interm]
        tmp2=1/np.sqrt(np.sum(np.power(tmp1,2),axis=1))
        tmp3=np.zeros([len(tmp1),len(tmp1[0])])
        tmp1=np.transpose(tmp1)
        for jj in range(len(tmp1)):
            tmp3[:,jj]=tmp2*(tmp1[:][jj])
        tmp4=np.sum(tmp3,axis=0)/len(data)
        tmp5=np.power((tmp4),2)
        tmp6=np.sum(tmp5)
        depths_tab.append(1-np.sqrt(tmp6))
    return np.array(depths_tab)
