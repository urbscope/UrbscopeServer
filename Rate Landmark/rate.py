import numpy as np
import pandas as pd
import sys

# Function to add the rating of the user with uid and destination with destID to the matrix
def rate(uid, destID, rating, filename):
	csv_file = pd.read_csv(filename, dtype=None)
	csv_file = csv_file.set_index('UserID')
	#print type(csv_file)
	#Check if destination exists
	if destID not in csv_file.columns:
		csv_file[destID] = pd.Series(0, index=csv_file.index)
	#print csv_file

	#Check if user exists
	if uid not in csv_file.index:
		# print "We are here because " + uid + " not here"
		temp = pd.DataFrame([[ 0 for x in xrange(len(csv_file.columns))]], index=[uid], columns=csv_file.columns)
		# pd.concat(temp, ignore_index=True)
		csv_file = pd.concat([csv_file, temp])
		csv_file.index.name="UserID"
		#csv_file.set_value(uid, np.nan)

	csv_file.to_csv(filename, sep=",")
	updateRating(uid, destID, rating, filename)


# Helper function of rate()
def updateRating(uid, destID, rating, filename):
	csv_file = pd.read_csv(filename, dtype=None)
	csv_file = csv_file.set_index('UserID')
	if rating >= 0 and rating <= 5:
		csv_file.loc[uid, destID] = rating
		csv_file.to_csv(filename, sep=",")
	else:
		print "Invalid rating"
		sys.exit(1)
	#print csv_file
	
if __name__ == "__main__":
	if len(sys.argv) != 5:
		print "Use: %s 'userID' 'landmarkID' 'rating' 'cityName.csv'" % sys.argv[0]
		sys.exit(1)
	else:
		uid = sys.argv[1]
		landmarkID = sys.argv[2]
		rating = int(sys.argv[3])
		filename = sys.argv[4]
		
		rate(uid, landmarkID, rating, filename)
		print "Landmark rating is updated"

