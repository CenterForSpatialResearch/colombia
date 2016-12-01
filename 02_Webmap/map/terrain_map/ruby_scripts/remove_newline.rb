orig_file = IO.read(ARGV[0])
javascript  = File.open("../lib/index.js","w+")
#newfile = orig_file.gsub("\n","],\n[").gsub(" ","-")
newfile=orig_file.split("\n")










javascript.write("var lookup={")

newfile.each_with_index do |x,index|

	line_string = x.split(",")
	javascript.write("\"#{line_string[3]}\":#{index}")

	

	javascript.write(",\n")

end
javascript.write("}")



# javascript.write("var csv = [")
# newfile.each do |x|
# 	javascript.write("#{x},")

# end

# javascript.write("]")