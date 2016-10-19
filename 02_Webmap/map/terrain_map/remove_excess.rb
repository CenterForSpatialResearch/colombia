orig_file = IO.read("Displacement_Edited.geojson")

word_array = orig_file.split("\" \"")

edited= File.open("Displacement_Edited.geojson", "w+")

coordinates=[]
current=[]

start = false
dest=true

word_array.each_with_index do |x,i|

	if x=="[" and word_array[i+1]== "["
		current.clear if current.size>0
		current.push(i+1)

		start=true
		#puts "start"
		start_string= "#{word_array[i]} #{word_array[i+1]} #{word_array[i+2]} #{word_array[i+3]} #{word_array[i+4]}" 
		edited.write(start_string)


	elsif x=="]" and word_array[i+1]=="]" and current.size==1
		current.push(i)
		#puts "end"
		end_string= "#{word_array[i-3]} #{word_array[i-2]} #{word_array[i-1]} #{word_array[i]} " 
		edited.write(end_string)
		start=false
		dest=true



	elsif start == true
		if word_array[i+1]!="]" and word_array[i+2]!="]"
			next
		end
	#elsif current.size==2
		#puts current
	#	coordinates<<current
	else
		if x.include? "{" and word_array[i+1].include? "type" and word_array[i+2].include? "Feature"
			edited.write("\n")
			edited.write("\n")

		end
		regular_word= "#{x} "
		edited.write(regular_word)
	end
end


i=0
j=0
k=0
=begin

while i<word_array.size do
	if i==coordinates[j][k]
		edited.write(word_array[i])
		puts i
		i+=1
	elsif i==(coordinates[j][k]+4)
		k+=1
		i=coordinates[j][k]-3
		puts i
		edited.write(word_array[i])
		puts word_array[i]
		j+=1
		k-=1
		i+=1
	else
		edited.write(word_array[i])
		puts i
		i+=1
	end
end


=end
=begin
#puts coordinates.to_s
word_array.each_with_index do |x,i|
	if coordinates[j][k]+4<=i<=coordinates[j][k+1]
		if i==coordinates[j][1]
			j+=1
		next
		end
	else
		#puts x
	end
end
=end