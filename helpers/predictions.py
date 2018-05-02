# import matplotlib
# import matplotlib.pyplot as plt
import numpy as np
from numpy import genfromtxt

DATAFILE = 'ratings.csv'

class MatrixFactorisation():

    def __init__(self, datMat, K, alpha, beta, iterCount):

        self.datMat = datMat
        self.userCount, self.itemCount = datMat.shape
        self.K = K
        self.alpha = alpha
        self.beta = beta
        self.iterCount = iterCount
        self.mat = []

    def train(self):
        self.P = np.random.normal(scale=1./self.K, size=(self.userCount, self.K))
        self.Q = np.random.normal(scale=1./self.K, size=(self.itemCount, self.K))

        self.userBias = np.zeros(self.userCount)
        self.itemBias = np.zeros(self.itemCount)
        self.b = np.mean(self.datMat[np.where(self.datMat != 0)])

        self.dataInput = [
            (i, j, self.datMat[i, j])
            for i in range(self.userCount)
            for j in range(self.itemCount)
            if self.datMat[i, j] > 0
        ]

        training_process = []
        for i in range(self.iterCount):
            np.random.shuffle(self.dataInput)
            self.sgd()
            rmse = self.rmse()

            training_process.append((i, rmse))
            if (i+1) % 10 == 0:
                print("Iteration: %d ; error = %.4f" % (i+1, rmse))

        return training_process

    def rmse(self):
        
        xs, ys = self.datMat.nonzero()
        predicted = self.getFullMat()
        error = 0
        for x, y in zip(xs, ys):
            error += pow(self.datMat[x, y] - predicted[x, y], 2)
        return np.sqrt(error)

    def sgd(self):
        
        for i, j, r in self.dataInput:
            prediction = self.getRating(i, j)
            err = (r - prediction)

            self.userBias[i] += self.alpha * (err - self.beta * self.userBias[i])
            self.itemBias[j] += self.alpha * (err - self.beta * self.itemBias[j])

            self.P[i, :] += self.alpha * (err * self.Q[j, :] - self.beta * self.P[i,:])
            self.Q[j, :] += self.alpha * (err * self.P[i, :] - self.beta * self.Q[j,:])

    def getRating(self, i, j):
        
        prediction = self.b + self.userBias[i] + self.itemBias[j] + self.P[i, :].dot(self.Q[j, :].T)
        return prediction

    def getFullMat(self):
        self.mat = self.b + self.userBias[:,np.newaxis] + self.itemBias[np.newaxis:,] + self.P.dot(self.Q.T)
        return self.mat

    def writeToFile(self):
        np.savetxt("trainedMat.csv", self.mat, delimiter = ",", fmt = '%.4f')

    def generateTrainingMat(self, fileName):
        self.datMat = genfromtxt(fileName, delimiter=',')
        return self.datMat




R = genfromtxt(DATAFILE, delimiter=',')
mf = MatrixFactorisation(R, K=4, alpha=0.1, beta=0.01, iterCount=100)


# mf = MatrixFactorisation(R, K=2, alpha=0.1, beta=0.01, iterCount=100)
trianingProcess= mf.train()
mf.getFullMat()
mf.writeToFile()
print mf.userBias



# x = [x for x, y in training_process]
# y = [y for x, y in training_process]
# plt.figure(figsize=((16,4)))
# plt.plot(x, y)
# plt.xticks(x, x)
# plt.xlabel("iterCount")
# plt.ylabel("Mean Square Error")
# plt.grid(axis="y")