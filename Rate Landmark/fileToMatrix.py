import random as rand
import numpy as np
import pandas as pd
import sys

"""
Matrix Format 
row1 = destination ID
col1 = user_id
matrix[0][0] = NULL
rest of matrix is ratings
"""

"""
File format: Destination ID, Destination Name, CategoryID
"""

# Generates matrix of the file after the file for that specific city is created
# uid is the first user of the city
def matrixGen(inputFile, uid, outputFile):
	f = open(inputFile, "r")
	contents = f.readlines()
	f.close()
	first_row = []
	for line in contents:
		dest_id = line.split(",")[0].strip(' \n\t')
		if dest_id not in first_row:
			first_row.append(dest_id)

	fr = "UserID,"
	# print first_row
	for elm in first_row:
		fr += elm + ","

	fr = fr[0:-1]
	f = open(outputFile, "w")
	f.write(fr + "\n")

	temp = str(uid)+","
	for j in xrange(len(first_row)):
		temp += "0,"
	temp = temp[:-1]
	f.write(temp + "\n")

	f.close()

	# ratings = np.zeros((10, len(first_row)))

	# print len(first_row)
	# for i in xrange(len(first_row)):
	# 	for j in xrange(10):
	# 		ratings[j][i] = int(rand.randint(0, 5))

	# f = open(city + ".csv", "w")
	# f.write(fr + "\n")
	# dim = ratings.shape[0]

	# for i in xrange(dim):
	# 	f.write(str(i+1) + ",")
	# 	temp = ""
	# 	for j in xrange(len(first_row)):
	# 		temp += str(float((ratings[i][j]))) + ","
	# 	temp = temp[:-1]
	# 	f.write(temp + "\n")

	return len(first_row)

if __name__ == '__main__':
	if len(sys.argv) != 4:
		print "Use: %s 'inputFile' 'userID' 'outputFile'" % sys.argv[0]
		sys.exit(1)
	else:
		inputFile = sys.argv[1]
		uid = sys.argv[2]
		outputFile = sys.argv[3]
		
		print matrixGen(inputFile, uid, outputFile)

