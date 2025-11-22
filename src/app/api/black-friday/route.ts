import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const blackFridaySchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  preferredContact: z.enum(['email', 'call', 'text']),
  email: z.string().optional(),
  phone: z.string().optional(),
  interestedInShirts: z.boolean(),
  interestedInHats: z.boolean(),
  shirtQuantity: z.number().optional(),
  hatQuantity: z.number().optional(),
  summary: z.string().min(10),
  honeypot: z.string().max(0),
}).refine(
  (data) => data.interestedInShirts || data.interestedInHats,
  {
    message: 'At least one product type must be selected',
    path: ['interestedInShirts'],
  }
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const dataString = formData.get('data') as string;
    const files = formData.getAll('files') as File[];

    if (!dataString) {
      return NextResponse.json(
        { error: 'Missing form data' },
        { status: 400 }
      );
    }

    const body = JSON.parse(dataString);

    // Validate the request body
    const validatedData = blackFridaySchema.parse(body);

    // Check honeypot field
    if (validatedData.honeypot) {
      return NextResponse.json(
        { error: 'Spam detected' },
        { status: 400 }
      );
    }

    const {
      firstName,
      lastName,
      preferredContact,
      email,
      phone,
      interestedInShirts,
      interestedInHats,
      shirtQuantity,
      hatQuantity,
      summary,
    } = validatedData;

    // Build product details string
    let productDetails = '';
    if (interestedInShirts && shirtQuantity) {
      productDetails += `<li><strong>Shirts:</strong> ${shirtQuantity} units @ $7 each = $${shirtQuantity * 7}</li>`;
    }
    if (interestedInHats && hatQuantity) {
      productDetails += `<li><strong>Hats:</strong> ${hatQuantity} units @ $7 each = $${hatQuantity * 7}</li>`;
    }

    const totalItems = (shirtQuantity || 0) + (hatQuantity || 0);
    const totalPrice = totalItems * 7;

    // Prepare file attachments
    const attachments = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return {
          filename: file.name,
          content: buffer,
        };
      })
    );

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: 'blackfriday@687merch.com',
      to: 'info+blackfriday@gmail.com',
      replyTo: email,
      subject: `🎉 Black Friday Lead: ${firstName} ${lastName} - ${totalItems} items ($${totalPrice})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f2bf00; padding: 20px; text-align: center;">
            <h1 style="margin: 0; color: #000; font-size: 28px;">
              🎉 BLACK FRIDAY LEAD 🎉
            </h1>
          </div>

          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #000; border-bottom: 2px solid #f2bf00; padding-bottom: 10px;">
              Contact Information
            </h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Preferred Contact:</strong> ${preferredContact.charAt(0).toUpperCase() + preferredContact.slice(1)}</p>
            ${email ? `<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>` : ''}
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}

            <h2 style="color: #000; border-bottom: 2px solid #f2bf00; padding-bottom: 10px; margin-top: 30px;">
              Order Details
            </h2>
            <ul style="list-style: none; padding: 0;">
              ${productDetails}
            </ul>
            <div style="background-color: #fff; padding: 15px; border-left: 4px solid #f2bf00; margin-top: 15px;">
              <p style="margin: 0;"><strong>Total Items:</strong> ${totalItems}</p>
              <p style="margin: 5px 0 0 0; font-size: 20px; color: #f2bf00; font-weight: bold;">
                Estimated Total: $${totalPrice}
              </p>
            </div>

            <h2 style="color: #000; border-bottom: 2px solid #f2bf00; padding-bottom: 10px; margin-top: 30px;">
              Project Summary
            </h2>
            <div style="background-color: white; padding: 15px; border-left: 4px solid #f2bf00; margin-top: 10px;">
              ${summary.replace(/\n/g, '<br>')}
            </div>

            ${files.length > 0 ? `
              <h2 style="color: #000; border-bottom: 2px solid #f2bf00; padding-bottom: 10px; margin-top: 30px;">
                Attachments
              </h2>
              <p>${files.length} file(s) attached</p>
              <ul>
                ${files.map(file => `<li>${file.name} (${(file.size / 1024).toFixed(2)} KB)</li>`).join('')}
              </ul>
            ` : ''}
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

          <p style="color: #666; font-size: 12px;">
            This lead was submitted from the 687 Merch Black Friday promotion page.
          </p>
        </div>
      `,
      text: `
BLACK FRIDAY LEAD

Contact Information:
Name: ${firstName} ${lastName}
Preferred Contact: ${preferredContact.charAt(0).toUpperCase() + preferredContact.slice(1)}
${email ? `Email: ${email}` : ''}
${phone ? `Phone: ${phone}` : ''}

Order Details:
${interestedInShirts && shirtQuantity ? `- Shirts: ${shirtQuantity} units @ $7 each = $${shirtQuantity * 7}` : ''}
${interestedInHats && hatQuantity ? `- Hats: ${hatQuantity} units @ $7 each = $${hatQuantity * 7}` : ''}

Total Items: ${totalItems}
Estimated Total: $${totalPrice}

Project Summary:
${summary}

${files.length > 0 ? `\nAttachments: ${files.length} file(s) attached` : ''}

---
This lead was submitted from the 687 Merch Black Friday promotion page.
      `,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Lead submitted successfully', id: emailResponse.data?.id },
      { status: 200 }
    );

  } catch (error) {
    console.error('Black Friday form error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
