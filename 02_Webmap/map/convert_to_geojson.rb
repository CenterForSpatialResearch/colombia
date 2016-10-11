orig_file = IO.read("DisplacementSample.json")
orig_file.gsub!("{","")
orig_file.gsub!("}","")
orig_file.gsub!("\"","")
displacement=orig_file.split(":")

geojson = File.open("DisplacementSample2.geojson", "w+")
geojson.write("[")

displacement.each_with_index do |x,i|

	if x=="paths"
		displacement[i+1][0]=''
		displacement[i+1].chomp!(",attributes")
		displacement[i+1].chomp!("]")
		geojson.write("{\"type\": \"LineString\",
			\"coordinates\": #{displacement[i+1]}},\n\n\n\n\n")
	end
end

geojson.close