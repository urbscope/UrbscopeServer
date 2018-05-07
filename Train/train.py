import numpy as np
import pandas as pd
from numpy import genfromtxt
from predictions import MatrixFactorisation
import time
start_time = time.time()

''' 
Paths below are  defined relative to train.js 
because this script is called by that function
'''
with open('./CityList.txt') as cityFile:
	cityList = cityFile.readlines()
for city in cityList:	
	city = (city.split(":"))[0] + ".csv"
	fileIn = '../Cities/CSV_Files/Ratings/' + city
	fileOut = '../Cities/CSV_Files/Trained/' + city
	
	df = pd.read_csv(fileIn, index_col = 0)
	data =  df.values
	print df
	mf = MatrixFactorisation(data, K=15, alpha=0.1, beta=0.01, iterCount=100)
	trianingProcess= mf.train()
	trained = mf.getFullMat()
	print df.index.dtype
	dfRes = pd.DataFrame(data=trained, columns = df.columns, index = (df.index).astype('string') )
	print dfRes
	dfRes.to_csv(fileOut)

print("--- %s seconds ---" % (time.time() - start_time))




# cityMat = genfromtxt('/media/yusuf/New Volume/UNI/Urbscope/Finals/recomenderSystem/Cities/CSV Files/Bangkok.csv', delimiter=',',dtype = 'unicode')
# landmarkList = cityMat[0,:]
# userList = cityMat[1:,0]
# data = cityMat[1:,1:]
# data = data.astype(float)
# #print data.dtype

# print userList.shape
# # print userList
# # print data

# rdata = genfromtxt('ratings.csv', delimiter=',')
# # print rdata
# # print data
# print data.dtype
# print rdata.dtype

# mf = MatrixFactorisation(data, K=15, alpha=0.1, beta=0.01, iterCount=100)
# trianingProcess= mf.train()
# trained = mf.getFullMat()
# print trained.shape
# trained = np.column_stack((userList,trained))
# trained = np.row_stack((landmarkList,trained))
# trained = trained.astype('string')
# print trained.dtype
# #np.savetxt("trainedMat_FromSET.csv", trained, delimiter = ",")
# print trained
# mf.writeToFile()


# raw_data = np.genfromtxt('data.txt', delimiter=',')[:,1:]
# data = {label: row for label, row in zip(labels, raw_data)}

# print cityMat
# userIndex = cityMat[0][0]
# print userIndex
 
	



