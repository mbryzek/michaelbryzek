<script lang="ts">
	import BlogPost from '$lib/components/blog/BlogPost.svelte';
	import BlogP from '$lib/components/blog/BlogP.svelte';
	import BlogH2 from '$lib/components/blog/BlogH2.svelte';
	import ExternalLink from '$lib/components/ui/ExternalLink.svelte';
</script>

<BlogPost title="Flow Commerce" date="2015 - 2022">
	<BlogP>
		After Gilt, I knew I wanted to build something new. The experience of scaling a global
		e-commerce business had exposed me to one of the biggest pain points in retail: selling
		internationally is incredibly hard.
	</BlogP>
	<BlogP>
		At Gilt, we had expanded to Japan and other international markets. The complexity was
		staggering: different currencies, payment methods, tax regulations, duties, shipping logistics,
		and localization requirements. Every country was different, and getting it wrong meant angry
		customers and regulatory headaches.
	</BlogP>

	<BlogH2>The Problem</BlogH2>
	<BlogP>
		For emerging brands, international expansion was nearly impossible. Large retailers could
		afford teams of specialists and custom integrations. But a growing DTC brand? They were stuck
		selling only domestically, missing out on the 95% of consumers who live outside the United
		States.
	</BlogP>
	<BlogP>
		The existing solutions were either too expensive, too complex, or required brands to give up
		control of their customer experience. I believed there had to be a better way.
	</BlogP>

	<BlogH2>Building Flow</BlogH2>
	<BlogP>
		In 2015, Rob Keve and I founded Flow Commerce in Hoboken, New Jersey. Rob had built and sold
		Fizzback, a customer experience company, and we shared a vision for what modern cross-border
		commerce should look like.
	</BlogP>
	<BlogP>
		Our thesis was simple: brands should be able to sell to customers anywhere in the world with
		the same ease as selling domestically. We would handle all the complexity—localization,
		currency conversion, payment processing, duty and tax calculation, and international
		shipping—so brands could focus on their products and customers.
	</BlogP>

	<BlogH2>The API Platform</BlogH2>
	<BlogP>
		From day one, we built Flow as an API-first platform. This was a deliberate architectural
		decision that shaped everything we did.
	</BlogP>
	<BlogP>
		Rather than forcing brands into a one-size-fits-all solution, our extensive API platform let
		them use exactly what they needed. Some brands wanted full localization with translated
		content. Others just needed duty and tax calculation. Some wanted us to handle fulfillment;
		others had their own logistics.
	</BlogP>
	<BlogP>
		The API-first approach also meant lightweight integrations. Brands could get started in days,
		not months. And because every capability was exposed through clean APIs, brands could build
		custom experiences on top of our infrastructure.
	</BlogP>
	<BlogP>
		We documented every API publicly on <ExternalLink href="https://docs.flow.io">docs.flow.io</ExternalLink>,
		making it easy for developers to understand our platform before even starting an integration.
		This transparency became a competitive advantage.
	</BlogP>

	<BlogH2>Growth and Recognition</BlogH2>
	<BlogP>
		Flow grew quickly. We worked with brands across fashion, beauty, home goods, and consumer
		electronics, helping them expand into new markets. Our platform processed millions of
		international orders, handling the complexity that would have been impossible for brands to
		manage on their own.
	</BlogP>
	<BlogP>
		In 2019, Rob and I were named Ernst & Young Entrepreneurs of the Year. That same year, we
		raised a $37 million Series B led by NEA, with participation from American Express Ventures
		and Latitude Ventures. Flow was also recognized on the CNBC Upstart 100 and The Lead's Leading
		100 lists.
	</BlogP>

	<BlogH2>Joining Global-e</BlogH2>
	<BlogP>
		In early 2022, Global-e acquired Flow for approximately $500 million. Global-e was the leading
		cross-border platform for enterprise brands, and Flow's technology and focus on emerging brands
		was a perfect complement.
	</BlogP>
	<BlogP>
		But the bigger story was what this acquisition enabled: Flow's technology would power Shopify's
		native cross-border solution.
	</BlogP>

	<BlogH2>Powering Shopify Managed Markets</BlogH2>
	<BlogP>
		Today, Flow's technology is at the heart of
		<ExternalLink href="https://www.shopify.com/international/managed">Shopify Managed Markets</ExternalLink>.
		Every Shopify merchant in the United States can now sell internationally with duties, taxes,
		and shipping handled automatically.
	</BlogP>
	<BlogP>
		When a customer in Germany or Japan or Australia shops at a Shopify store, Flow's technology
		calculates the duties and taxes, handles the currency conversion, and ensures a seamless
		checkout experience. The merchant doesn't need to understand international tax law or set up
		foreign entities. They just sell.
	</BlogP>
	<BlogP>
		This was always the vision: making international commerce accessible to everyone, not just the
		largest retailers. Seeing Flow's technology enable millions of Shopify merchants to sell
		globally is incredibly rewarding.
	</BlogP>

	<BlogH2>Lessons Learned</BlogH2>
	<BlogP>
		Flow reinforced some lessons from Gilt and taught me new ones:
	</BlogP>
	<BlogP>
		API-first architecture pays dividends. The upfront investment in clean, well-documented APIs
		made everything else easier: integrations, partnerships, and ultimately the acquisition.
	</BlogP>
	<BlogP>
		Solve real problems. Cross-border commerce is genuinely hard. We succeeded because we tackled
		complexity that brands couldn't solve on their own, not because we had clever marketing.
	</BlogP>
	<BlogP>
		Partnerships matter. Our relationship with Shopify transformed what Flow could achieve. Finding
		the right partners who share your vision can multiply your impact.
	</BlogP>

	<BlogH2>Learn More</BlogH2>
	<BlogP>
		<ExternalLink href="https://techcrunch.com/2019/12/04/flow-series-b/">
			TechCrunch: Flow raises $37M
		</ExternalLink>
		- Coverage of our Series B funding
	</BlogP>
	<BlogP>
		<ExternalLink href="https://www.flow.io/">
			Flow.io
		</ExternalLink>
		- The Flow Commerce platform
	</BlogP>
	<BlogP>
		<ExternalLink href="https://www.shopify.com/international/managed">
			Shopify Managed Markets
		</ExternalLink>
		- Flow's technology powering international commerce for Shopify merchants
	</BlogP>
</BlogPost>
