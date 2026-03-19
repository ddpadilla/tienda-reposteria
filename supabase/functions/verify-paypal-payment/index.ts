Deno.serve(async (req) => {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
  const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET');

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'apikey, X-Client-Info, Content-Type, Authorization, Accept, Accept-Language, X-Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { orderId, customerName, customerEmail, customerPhone, deliveryAddress, totalHNL, notes, items } = await req.json();

    if (!orderId || !customerName || !customerEmail || !customerPhone || !totalHNL || !items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Faltan datos requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener access token de PayPal (MODO LIVE)
    const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
    const tokenResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      return new Response(
        JSON.stringify({ error: 'Error al autenticar con PayPal' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar el pago en PayPal (MODO LIVE)
    const captureResponse = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    const captureData = await captureResponse.json();

    if (captureData.status !== 'COMPLETED') {
      return new Response(
        JSON.stringify({ error: 'Pago no completado', status: captureData.status }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Crear la orden en Supabase
    const orderResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY!,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress || null,
        total_hnl: totalHNL,
        status: 'pagado_total',
        payment_method: 'paypal',
        notes: notes || null,
      }),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      return new Response(
        JSON.stringify({ error: 'Error al crear orden', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener el ID de la orden creada
    const ordersResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders?customer_email=eq.${encodeURIComponent(customerEmail)}&order=created_at.desc&limit=1`, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY!,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });

    const ordersData = await ordersResponse.json();
    const orderIdSupabase = ordersData[0]?.id;

    // Insertar los items de la orden
    for (const item of items) {
      await fetch(`${SUPABASE_URL}/rest/v1/order_items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_ROLE_KEY!,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          order_id: orderIdSupabase,
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          unit_price_hnl: item.unitPrice,
        }),
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: orderIdSupabase,
        paypalStatus: captureData.status 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
