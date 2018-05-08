import numpy as np
from glob import glob as gl
import sys
import os

def readMatrix(filename):
	mat = np.genfromtxt(open(filename, "rb"), dtype=None, delimiter=",", names=True, autostrip=True, case_sensitive=True)
	return mat

# Returns the top k destinations for user with uid in this city 
def getRecommendation(city, uid, k):
	# path is relative to app.js since this script is called by app.js
	#cities = gl("./Cities/CSV_Files/Trained/*.csv")
	path = "./Cities/CSV_Files/Trained/"
	if os.path.isdir(path) == False:
		return -1
	cities = gl(path + "*.csv")
	
	found = 0
	filename = ""
	for c in cities:
		if city in c:
			found = 1
			filename = c
			break

	if found:
		matrix = readMatrix(c)
		index = 0
		user_found = 0
		for user in xrange(len(matrix)):
			if uid.strip(' \t\n') == str(matrix[user][0]).strip(' \t\n'):
				index = user
				user_found = 1
				break
		if user_found:
			f = open(c, "r")
			fr = f.readline().split(",")[1:]
			#print fr
			x = np.array(matrix[index].tolist())
			x = x[1:]
			desired = [float(x[i]) for i in xrange(len(x))]
			#print desired
			if len(desired) < k:
				return [fr[i].strip(" \t\n") for i in xrange(len(fr))]
			else:
				newArr = []
				indices = [i[0] for i in sorted(enumerate(desired), reverse=True, key=lambda x:x[1])]
				for j in xrange(k):
					newArr.append(fr[indices[j]].strip(" \t\n"))
				return newArr
		else:
			return 0
	else:
		return 0

if __name__ == "__main__":
	if len(sys.argv) != 4:
		print "Use: %s 'cityName' 'userID' 'K'" % sys.argv[0]
		sys.exit(1)
	else:
		cityName = sys.argv[1]
		uid = str(sys.argv[2])
		topK = int(sys.argv[3])
		
		IDs = getRecommendation(cityName, uid, topK)
		
		if IDs == 0:
			print 0
		elif IDs == -1:
			print -1
		else:
			print ','.join(IDs)
		
