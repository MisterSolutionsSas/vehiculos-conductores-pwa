const usuarios = [
  { email: 'elplacer999@gmail.com', contraseña: 'adminelplacer999', rol: 'admin' },
  { email: 'admin1@elplacer.com', contraseña: 'adminelplacer999', rol: 'admin' },
  { email: 'admin2@elplacer.com', contraseña: 'adminelplacer999', rol: 'admin' },
  { email: 'admin3@elplacer.com', contraseña: 'adminelplacer999', rol: 'admin' },
  { email: 'admin4@elplacer.com', contraseña: 'adminelplacer999', rol: 'admin' },
  { email: 'admin5@elplacer.com', contraseña: 'adminelplacer999', rol: 'admin' },
  { email: 'conductor@demo.com', contraseña: 'conductor1234', rol: 'conductor' },
];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email, contraseña } = req.body;

    const usuario = usuarios.find(
      (u) => u.email === email && u.contraseña === contraseña
    );

    if (usuario) {
      const tokenData = {
        email: usuario.email,
        rol: usuario.rol,
      };

      res.status(200).json({ success: true, token: JSON.stringify(tokenData) });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } else {
    res.status(405).end();
  }
}
