import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nom, email et message sont requis' },
        { status: 400 }
      );
    }

    const API_KEY = process.env.BREVO_API_KEY;
    
    const data = {
      sender: {
        name: name,
        email: email
      },
      to: [
        {
          email: "mathys0@hotmail.fr", 
          name: "Votre Nom"
        }
      ],
      subject: `Nouveau message de contact de ${name}`,
      htmlContent: `
        <h2>Nouveau message du formulaire de contact</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    await axios.post('https://api.brevo.com/v3/smtp/email', data, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY
      }
    });

    return NextResponse.json(
      { success: true, message: 'Email envoyé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}