orig_file = IO.read(ARGV[0])
word_array = orig_file.split("\n")

edited= File.open("cities.js", "w+")

edited.write("var cities = [")



cities=Hash.new "" 
word_array.each_with_index do |x,i|
	feature = x.gsub("\"","").gsub(",","").split(" ")
current=""
	feature.each_with_index do |z,j|
		
		if z.include? "OrgMun"
				tmp=j+1
				
			until feature[tmp].include? "DestMun" do
				current+= "#{feature[tmp]} "

				
				tmp+=1
			end
			cities[current]=0

		elsif z.include? "coord"
			coordinates=[]
			coordinates.push(feature[j+4])

			coordinates.push(feature[j+3])
			
			coordinates.each do |x|
				x.gsub!("\"","")
			end
			cities[current]=coordinates
			#puts cities[current].to_s
		end

	end
end
cities.each do |k,v| 
	edited.write( "[\"#{k}\", [#{v[0]}, #{v[1]}]],")
	edited.write("\n")
end
edited.write("]")