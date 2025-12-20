<script lang="ts">
	import BlogPost from '$lib/components/blog/BlogPost.svelte';
	import BlogP from '$lib/components/blog/BlogP.svelte';
	import BlogH2 from '$lib/components/blog/BlogH2.svelte';
	import ExternalLink from '$lib/components/ui/ExternalLink.svelte';
</script>

<BlogPost title="Gilt Groupe" date="2007 - 2016">
	<BlogP>
		In the spring of 2007, Kevin Ryan called me with an idea. Kevin, who I had worked with at
		DoubleClick, wanted to bring the European flash sale model to the United States. The concept was
		simple but compelling: offer luxury designer goods at steep discounts for a limited time, creating
		urgency and exclusivity.
	</BlogP>
	<BlogP>
		Kevin had already recruited Phong Nguyen, another DoubleClick engineer, and soon Alexis Maybank
		and Alexandra Wilson joined to lead business operations. I came on as CTO. We launched our first
		sale in November 2007, and it was an immediate success.
	</BlogP>

	<BlogH2>The Flash Sale Model</BlogH2>
	<BlogP>
		Gilt's model was deceptively simple: every day at noon, we would launch new sales featuring
		luxury brands at 50-70% off retail prices. Sales lasted 36 hours, and quantities were limited.
		Members received an email each morning previewing the upcoming sales, creating anticipation and
		a daily ritual.
	</BlogP>
	<BlogP>
		What made Gilt different was the combination of exclusivity and urgency. You had to be a member
		to shop. Items sold out quickly. If you hesitated, you missed out. This created an addictive
		shopping experience that kept members coming back every day.
	</BlogP>

	<BlogH2>Building Half an Amazon in One Year</BlogH2>
	<BlogP>
		From a technical perspective, Gilt was one of the most challenging projects I've ever worked on.
		We essentially had to build half of Amazon's infrastructure in about a year: product catalog,
		inventory management, order processing, payment systems, customer service tools, and a
		fulfillment operation.
	</BlogP>
	<BlogP>
		But our unique challenge was the noon spike. Every single day, traffic would increase by 1000%
		in the minutes after a sale launched. Members would race to grab items before they sold out,
		creating massive concurrent load. Traditional e-commerce architectures couldn't handle this
		pattern.
	</BlogP>
	<BlogP>
		We started with Ruby on Rails, which served us well in the early days. But as we scaled, we
		needed something more robust. We were early adopters of Scala, building out a microservices
		architecture that could handle the daily surge while remaining stable during quieter periods.
	</BlogP>

	<BlogH2>Growth and Impact</BlogH2>
	<BlogP>
		Gilt grew explosively. Within five years, we reached a $1 billion valuation, becoming one of
		New York's most successful startups. At our peak, we had over 9 million members and were
		generating hundreds of millions in annual revenue.
	</BlogP>
	<BlogP>
		More importantly, we helped establish New York as a serious tech hub. Before Gilt, the
		conventional wisdom was that successful tech companies had to be in Silicon Valley. We proved
		that wasn't true, and we helped build a community of engineers and entrepreneurs in NYC.
	</BlogP>

	<BlogH2>Lessons Learned</BlogH2>
	<BlogP>
		Looking back, Gilt taught me several lessons that have shaped everything I've done since:
	</BlogP>
	<BlogP>
		First, the importance of a strong founding team. Each of us brought different skills and
		perspectives. Kevin understood markets and strategy. Alexis and Alexandra knew fashion and
		retail. Phong and I handled technology. We trusted each other and moved fast.
	</BlogP>
	<BlogP>
		Second, constraints breed creativity. The noon spike forced us to innovate in ways we never
		would have otherwise. Some of our best architectural decisions came from having to solve
		problems that most e-commerce companies never face.
	</BlogP>
	<BlogP>
		Third, culture matters. We built a team that was passionate about what we were creating. People
		worked incredibly hard because they believed in the mission and enjoyed working together.
	</BlogP>
	<BlogP>
		In 2016, Gilt was acquired by Hudson's Bay Company. By then, I had already moved on to my next
		venture, but the experience of building Gilt remains one of the highlights of my career.
	</BlogP>

	<BlogH2>Learn More</BlogH2>
	<BlogP>
		<ExternalLink href="https://www.startupgrind.com/blog/fireside-chat-with-michael-bryzek-co-founder-and-cto-of-gilt-groupe/">
			Startup Grind Fireside Chat
		</ExternalLink>
		- A conversation about the Gilt journey
	</BlogP>
	<BlogP>
		<ExternalLink href="https://news.mit.edu/2016/michael-bryzek-new-york-entrepreneurship-1019">
			MIT News Profile
		</ExternalLink>
		- On entrepreneurship and building companies in New York
	</BlogP>
	<BlogP>
		<ExternalLink href="https://www.entrepreneur.com/article/238899">
			Entrepreneur: 5 Secrets of Founder Relationships
		</ExternalLink>
		- What made our founding team work
	</BlogP>
</BlogPost>
