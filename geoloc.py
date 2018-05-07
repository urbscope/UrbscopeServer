# http://geocoder.readthedocs.io/providers/Google.html

''' 
Given latitude and longitude, finds the city they belong to. 
Requires pip install geocoder 
'''
import pip
try:
	import geocoder
except Exception as e:
	isSucceeded = pip.main(["install", geocoder])
	if( not isSucceeded):
		raise e
	else:
		import geocoder
import os
import sys
import time

def findCityName( lat, long):


	''' 
	API key path is defined relative to app.js 
	because we're calling this script from there
	'''
	f = open( "./GOOGLE_GEOCODER_API_KEY", 'r')
	API_KEY = f.read()
	os.environ["GOOGLE_API_KEY"] = API_KEY

	g = geocoder.google([lat, long], method='reverse')
	
	'''
	print "city %s" % g.city
	print "state %s" % g.state
	print "state_long %s" % g.state_long
	print "country %s" % g.country
	print "country_long %s" % g.country_long
	'''
	return g.state_long if g.city is None else g.city

if __name__ == "__main__":
	#lat = 52.346483 #39.963857
	#long = 4.879718 #32.898442
	
	if len(sys.argv) != 3:
		print "Use: %s %s %s" %(sys.argv[0], "'latitude'", "'longitude'")
		sys.exit(1)
	else:
		lat = float(sys.argv[1])
		long = float(sys.argv[2])
		
		
		# Wait for 3 secs because even though 
		# the location is valid, it sometimes returns None.
		city = None
		start = time.time()
		elapsed_time = 0
		while city == None and elapsed_time < 3:
			city = findCityName( lat, long)
			elapsed_time = time.time() - start
		
		if city != None:		
			# note that type of city is unicode
			print city.encode("utf-8")
		else:
			print "nowhere!"
		
