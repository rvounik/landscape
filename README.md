
# landscape

quick javascript canvas experiment that projects a 2d map as a pseudo 3d view

note that this is using some crude, random interpolation to get the heights of each ray in the projection. improving on that in a future iteration. you can navigate using cursor keys.

demo: http://www.vanooij.nl/r8/uploads/landscape/landscape.html

# prerequisites

- ruby 2.x
needed for: running scss-lint
installation: sudo apt-get install ruby2.0
(you may need rvm to properly switch to ruby 2.x)

- scss-lint
needed for: linting scss
installation: sudo gem install scss-lint

- compass
needed for: compiling scss into css
installation: sudo gem install compass
