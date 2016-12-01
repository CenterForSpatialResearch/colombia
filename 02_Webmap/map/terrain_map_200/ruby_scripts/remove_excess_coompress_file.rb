orig_file = IO.read(ARGV[0])
word_array = orig_file.split("\n")

edited= File.open("DisplacementLargeEdited_50+.geojson", "w+")
edited.write(word_array[0])
edited.write("\n\n")
#puts word_array[0]
word_array.each_with_index do |x,i|
	feature = x.split(" ")

	feature.each_with_index do |z, i|
		if z.include? "Count" and feature[i+1].to_i>50
		#if z.include? "Count"
			#puts feature
			edited.write(x)
			edited.write("\n")
		end
	end

end


