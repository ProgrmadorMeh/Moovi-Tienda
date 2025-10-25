# dev.nix
let
  pkgs = import <nixpkgs> {};
in
pkgs.mkShell {
  # Paquetes que queremos en el entorno
  buildInputs = [
    pkgs.nodejs_20
    pkgs.zulu
    pkgs.docker        # Docker incluido
    pkgs.supabase-cli  # Supabase CLI incluido
  ];

  # Variables de entorno
  shellHook = ''
    echo "Bienvenido a tu entorno de desarrollo Studio + Supabase + Docker"
  '';
}
