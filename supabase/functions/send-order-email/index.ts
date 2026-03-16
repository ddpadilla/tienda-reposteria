Deno.serve(async (req) => {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  const SUPPORT_EMAIL = Deno.env.get('SUPPORT_EMAIL') || 'sac@sweetbloom.com';
  
  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'RESEND_API_KEY no configurada' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const { order_id, customer_email, customer_name, total_hnl, payment_method, customer_phone, delivery_address } = await req.json();

    const settingsRes = await fetch(`${SUPABASE_URL}/rest/v1/payment_settings?is_active=eq.true&limit=1`, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY!,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });
    
    const settings = await settingsRes.json();
    const paymentSettings = settings[0] || {
      bank_name: 'Banco de Honduras',
      account_number: '2001112233',
      account_holder: 'Sweet Bloom',
      instructions: '<p>Realiza tu transferencia como anticipo del 50%.</p><p>Envía el comprobante por WhatsApp o correo.</p>',
      advance_percentage: 50,
      whatsapp: '+50455556756',
      email: 'sac@sweetbloom.com'
    };

    const advanceAmount = (total_hnl * (paymentSettings.advance_percentage / 100));
    const remainingAmount = total_hnl - advanceAmount;

    const subject = payment_method === 'paypal' 
      ? 'Confirmación de tu pedido Sweet Bloom' 
      : 'Pedido recibido - Sweet Bloom';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FDF8F3; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 8px; overflow: hidden; }
            .header { background: #3D2C2C; color: #C9A962; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-family: Georgia, serif; }
            .content { padding: 30px; color: #3D2C2C; }
            .footer { background: #F5EDE6; padding: 20px; text-align: center; font-size: 12px; color: #6B5B5B; }
            .highlight { background: #E8D5D5; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .bank-details { background: #F5EDE6; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .steps { margin: 20px 0; }
            .steps li { margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Sweet Bloom</h1>
            </div>
            <div class="content">
              <h2>¡Gracias por tu pedido, ${customer_name}!</h2>
              
              <div class="highlight">
                <p><strong>Número de pedido:</strong> ${order_id?.slice(0, 8).toUpperCase() || 'N/A'}</p>
                <p><strong>Total:</strong> L ${total_hnl?.toFixed(2) || '0.00'}</p>
                <p><strong>Método de pago:</strong> ${payment_method === 'paypal' ? 'PayPal (Pagado)' : 'Transferencia (Pendiente)'}</p>
              </div>
              
              ${payment_method === 'transferencia' ? `
                <h3>Instrucciones de pago:</h3>
                <p>Por favor realiza el pago del ${paymentSettings.advance_percentage}% (L ${advanceAmount.toFixed(2)}) como anticipo.</p>
                
                <div class="bank-details">
                  <p><strong>Banco:</strong> ${paymentSettings.bank_name}</p>
                  <p><strong>Cuenta:</strong> ${paymentSettings.account_number}</p>
                  <p><strong>Titular:</strong> ${paymentSettings.account_holder}</p>
                </div>

                ${paymentSettings.instructions ? `<div>${paymentSettings.instructions}</div>` : ''}
                
                <h3>¿Cómo continuar?</h3>
                <ol class="steps">
                  <li>Realiza la transferencia por L ${advanceAmount.toFixed(2)}</li>
                  <li>Toma una foto del comprobante</li>
                  <li>Envía el comprobante por WhatsApp: ${paymentSettings.whatsapp}</li>
                  <li>O por correo: ${paymentSettings.email}</li>
                </ol>
                
                <p><strong>Nota:</strong> El 50% restante (L ${remainingAmount.toFixed(2)}) se pagal al momento de la entrega.</p>
              ` : `
                <p>Tu pedido ha sido confirmado y está siendo procesado.</p>
              `}
              
              <p>Te enviaremos actualizaciones sobre el estado de tu pedido.</p>
              
              <p>Con cariño,<br>El equipo de Sweet Bloom</p>
            </div>
            <div class="footer">
              <p>Sweet Bloom - Repostería Artesanal de Lujo</p>
              <p>San Pedro Sula, Honduras</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const adminHtmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FDF8F3; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 8px; overflow: hidden; }
            .header { background: #3D2C2C; color: #C9A962; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-family: Georgia, serif; }
            .content { padding: 30px; color: #3D2C2C; }
            .highlight { background: #E8D5D5; padding: 15px; border-radius: 4px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Sweet Bloom - Nuevo Pedido</h1>
            </div>
            <div class="content">
              <h2>Nuevo pedido recibido</h2>
              
              <div class="highlight">
                <p><strong>Cliente:</strong> ${customer_name}</p>
                <p><strong>Email:</strong> ${customer_email}</p>
                <p><strong>Teléfono:</strong> ${customer_phone}</p>
                <p><strong>Dirección:</strong> ${delivery_address || 'No especificada'}</p>
                <p><strong>Total:</strong> L ${total_hnl?.toFixed(2) || '0.00'}</p>
                <p><strong>Método de pago:</strong> ${payment_method === 'paypal' ? 'PayPal (Pagado)' : `Transferencia - Anticipo ${paymentSettings.advance_percentage}% (Pendiente)`}</p>
              </div>
              
              <p><strong>Pedido ID:</strong> ${order_id?.slice(0, 8).toUpperCase() || 'N/A'}</p>
              
              ${payment_method === 'transferencia' ? `
                <p><em>Esperando confirmación del anticipo...</em></p>
              ` : ''}
            </div>
          </div>
        </body>
      </html>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Sweet Bloom <onboarding@resend.dev>',
        to: [customer_email],
        cc: [SUPPORT_EMAIL],
        subject: subject,
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: data.message }),
        { status: res.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
