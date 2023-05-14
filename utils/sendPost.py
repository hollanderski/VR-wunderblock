import requests

def testSendPost():
	uniqueName="1234"
	audiofile="audio"+uniqueName+".mp3"
	bumpmapfile = "bumpmap"+uniqueName+".png"
	mapfile = "map"+uniqueName+".png"
	files = {
		"audio" : open(audiofile, 'rb'),
		"bumpmap" : open(bumpmapfile, 'rb'),
		"map" : open(mapfile, 'rb'),
		}
	print(files)
	response = requests.post('http://localhost:3000/postdata', files=files)
	print(response.content)

testSendPost()


