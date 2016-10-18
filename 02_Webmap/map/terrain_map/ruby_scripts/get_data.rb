orig = IO.read("Displacement_Edited.geojson")
geojson= orig.gsub(",","").gsub("\"","").split(" ")



hash={}
hash.default=0
geojson.each_with_index do |x,i|
	if x.include? "OrgMun"
		hash[geojson[i+1]]=hash[geojson[i+1]]+1
	end
end

out= File.open("links.txt", "w+")
hash.each do |key,value|

	out.write "<option value=\"#{key}\">#{key}</option>\n"
end



