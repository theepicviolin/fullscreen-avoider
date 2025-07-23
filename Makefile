#=============================================================================
UUID=fullscreen-avoider@noobsai.github.com
SRCDIR=src
BUILDDIR=build
EXTENSIONDIR=~/.local/share/gnome-shell/extensions
#=============================================================================
clean:
	rm -rf $(BUILDDIR)

build: clean
	mkdir -p $(BUILDDIR)
	cp -r $(SRCDIR) $(BUILDDIR)/$(UUID)
	glib-compile-schemas $(BUILDDIR)/$(UUID)/schemas
	cp -r $(BUILDDIR)/$(UUID) ~/.local/share/gnome-shell/extensions

zip: build
	cd $(BUILDDIR)/$(UUID) && zip -r $(UUID).zip * && mv $(UUID).zip ../

install: uninstall build
	mkdir -p $(EXTENSIONDIR)/$(UUID)
	cp -r $(BUILDDIR)/$(UUID) $(EXTENSIONDIR)

uninstall:
	rm -rf $(EXTENSIONDIR)/$(UUID)

debug_install: uninstall
	ln -s "$(realpath ./)/$(SRCDIR)" $(UUID)
	mv $(UUID) $(EXTENSIONDIR)
