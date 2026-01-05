import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nom, email et message sont requis' },
        { status: 400 }
      );
    }

    // Validation simple de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    const API_KEY = process.env.BREVO_API_KEY;

    if (!API_KEY || API_KEY === 'undefined') {
      return NextResponse.json(
        { error: 'Clé API Brevo manquante ou invalide' },
        { status: 500 }
      );
    }

    const data = {
      sender: {
        name,
        email
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

  } catch (error: any) {
    // Log détaillé
    console.error("Erreur lors de l'envoi de l'email :");
    if (axios.isAxiosError(error)) {
      console.error("Message :", error.message);
      console.error("Réponse :", error.response?.data || error.toJSON());
    } else {
      console.error(error);
    }

    return NextResponse.json(
      {
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Erreur inconnue lors de l'envoi de l'email"
      },
      { status: 500 }
    );
  }
}
