orig = IO.read("Displacement_Edited.geojson")
geojson= orig.gsub(",","").split(" ");



array=[]
geojson.each_with_index do |x,i|
	if x.include? "Count"
		array.push(geojson[i+1].to_i)
	end
end


puts array.sort