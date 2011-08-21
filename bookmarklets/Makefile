all:
	@echo "bad monkey"

%.bm:%.js
	./create_bookmarklet $< > $@

%.out:%.js
	./create_bookmarklet $<

%.html:%.js
	./create_bookmarklet -html $< > $@

clean:
	rm -f *~