export async function GET() {
	return new Response(JSON.stringify({
	  name: 'memo',
	  short_name: 'memo',
	  start_url: '/jot/',
	  display: 'standalone',
	  background_color: 'white',
	  theme_color: 'white',
	  icons: [{
      src: 'https://static.rosano.ca/rcreativ/touch.png',
      sizes: '600x600',
      type: 'image/png',
      purpose: 'any maskable'
    }],
	}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
}
