import numpy as np
from hmmlearn import hmm
np.random.seed(42)

model = hmm.GaussianHMM(n_components=3, covariance_type="full", verbose=True, n_iter=100)
model.startprob_ = np.array([0.6, 0.3, 0.1])
model.transmat_ = np.array([[0.7, 0.2, 0.1],[0.3, 0.5, 0.2],[0.3, 0.3, 0.4]])
model.means_ = np.array([[0.0, 0.0], [3.0, -3.0], [5.0, 10.0]])
model.covars_ = np.tile(np.identity(2), (3, 1, 1))
X, Z = model.sample(100)
print("X: ",X)
print("Z: ",Z)
A, B = model.sample(100)
print("A: ",A)
print("B: ",B)
#print(model.fit(X))
'''
model.fit(X)
Z2 = model.predict(X)
model.monitor_  
model.monitor_.converged
'''

filename = "LONGcombinedData.1.26.18.txt"
file = open(filename, "r")


remodel = hmm.GaussianHMM(n_components=3, covariance_type="full", n_iter=100, verbose=True)
print(remodel)
print(remodel.fit(X))  
print(remodel.predict(X))
print(remodel.predict_proba(X))