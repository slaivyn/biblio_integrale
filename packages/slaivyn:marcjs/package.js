Package.describe({
  summary: "marcjs for Meteor"
});

Npm.depends({
  'marcjs': "https://github.com/fredericd/marcjs/tarball/545ab0fc580c00293c5304aa35ed7148d3d8045f"
});

Package.onUse(function (api) {
  api.add_files('main.js', 'server');
  api.export(['marc']);
});
