<script lang="ts">
	import BlogPost from '$lib/components/blog/BlogPost.svelte';
	import BlogP from '$lib/components/blog/BlogP.svelte';
	import BlogH2 from '$lib/components/blog/BlogH2.svelte';
	import BlogList from '$lib/components/blog/BlogList.svelte';
	import BlogCode from '$lib/components/blog/BlogCode.svelte';
	import ExternalLink from '$lib/components/ui/ExternalLink.svelte';

	interface Props {
		title: string;
		date: string;
	}

	let { title, date }: Props = $props();
</script>

<BlogPost {title} {date}>
	<BlogP>
		I've now built a few different applications in Elm - everything from simple event websites to
		more complex SAAS based applications. I've iterated multiple times on structuring single-page
		applications in Elm. My focus has been on managing state efficiently across pages, templates, and
		shared components that can be rendered across multiple pages.
	</BlogP>
	<BlogP>
		I thought it'd be helpful to share the approach I've so far standardized on - and to do so I've
		built a very simple, plain web application demonstrating the various places where state is
		managed including:
	</BlogP>
	<BlogList
		items={[
			"Simple pages that don't need a model nor any commands",
			'Stateful pages',
			'A global template that itself has state'
		]}
	/>
	<BlogP>
		In this application, we also demonstrate how to implement Login, Logout and profile updates which
		may then impact other components (e.g. changing your name in the application should immediately
		update the global template).
	</BlogP>
	<BlogP>
		Hope you find this useful and if you have any suggestions, improvements or questions please do
		share!
	</BlogP>
	<BlogH2>Source Code & Live Demo</BlogH2>
	<BlogP>
		Source Code: <ExternalLink href="https://github.com/mbryzek/state-management-in-elm"
			>GitHub Repo</ExternalLink
		>
	</BlogP>
	<BlogH2>Authentication</BlogH2>
	<BlogP>
		I've found that it has been helpful to handle authentication in Main.elm as this provides a
		single place to check state and enables us to create pages that document whether or not they
		require a user to be logged in.
	</BlogP>
	<BlogP>
		My approach has been to define a type 'GlobalState' type which tracks authentication status:
	</BlogP>
	<BlogCode
		lines={[
			'type GlobalState',
			'   = GlobalStateAnonymous GlobalStateAnonymousData',
			'   | GlobalStateAuthenticated GlobalStateAuthenticatedData'
		]}
	/>
	<BlogP>
		Within main then, we need to first initialize the state and then route to the appropriate page.
		This also means that we can centralize the logic on when to ask the user to login or register
		directly from Main.
	</BlogP>
	<BlogP>
		To handle initialization, we declare the Model in Main as either being in the init state
		(InitModel) or Ready (ReadyModel).
	</BlogP>
	<BlogCode lines={['type Model', '   = Init InitModel', '   | Ready ReadyModel']} />
	<BlogP>
		If we initialize the application with a session id - we will then load the session and upon
		completion continue with a ready model.
	</BlogP>
	<BlogP>Example of redirecting the user to login as necessary:</BlogP>
	<BlogCode
		lines={[
			'Just Route.RouteRestricted ->\n',
			'    pageAuthenticatedData global (\\g ->\n',
			'        ( PageRestricted.init g |> PageRestricted, Cmd.none)\n',
			'    )'
		]}
	/>
	<BlogP>
		The method pageAuthenticatedData will parse the global state and either redirect the user to
		login or else init PageRestricted, passing in the fully authenticated information.
	</BlogP>
	<BlogH2>Update</BlogH2>
	<BlogP>
		When invoking update from Main, we construct the arguments we need based on what the page
		requires. Possibilities include:
	</BlogP>
	<BlogList
		items={[
			'The specific type of GlobalState the page requires',
			'A msgMap to convert page messages back into the Main Msg type. We\'ll need this when handling login or other events',
			'Variants to handle onLoggedIn, onLoggedOut, OnSessionUpdate which are essentially callbacks to Main when one of these events happen.'
		]}
	/>
	<BlogP>
		For pages that use the global template (called Shell in this application), we provide the
		Shell.ViewProps which contain the model for the Shell itself as well as a function to map
		messages in the template to the Main Msg type
	</BlogP>
	<BlogP>The key design goals here are to:</BlogP>
	<BlogList
		items={[
			'Minimize the boilerplate in Pages by providing only what the page needs',
			'Centralizing key State where it belongs - Main owns the Global State. Shell owns the Shell Model. All operations on this state have a single owner and the current state is passed to pages or components as needed.'
		]}
	/>
	<BlogP>
		As an example - when you increment the counter in the header, that message is handled by the
		ShellMsg defined in Main - and then updates are passed in explicitly to all pages that render the
		template. This is how we ensure state changes propagate immediately to all components.
	</BlogP>
	<BlogH2>Public Page</BlogH2>
	<BlogP>
		The page Content is available to all users. This page does not actually need any global data in
		any of the normal Elm functions (init, update, view) and thus uses a comment to specify that the
		page should be accessible by anonymous users:
	</BlogP>
	<BlogCode
		lines={[
			'-- codegen.global.state: GlobalStateAnonymousData',
			'module Page.Content exposing (view)'
		]}
	/>
	<BlogH2>Restricted Page</BlogH2>
	<BlogP>
		The page Restricted is available only to logged in users, but similarly does not access Global
		State in any of the standard elm functions. Thus we document that authentication is required with
		a comment:
	</BlogP>
	<BlogCode
		lines={[
			'-- codegen.global.state: GlobalStateAuthenticatedData',
			'module Page.Restricted exposing (Model, Article, init, view)'
		]}
	/>
	<BlogH2>Code Generation</BlogH2>
	<BlogP>In my own work and applications, I use a built code generators which works by:</BlogP>
	<BlogList
		items={[
			'Find all files under src/Page',
			'Parse the init, update, and view functions to understand the arguments and return values',
			'Generates the code you see in Main.elm based on the type signatures of those functions'
		]}
	/>
	<BlogP>
		Broadly the goal is to fully standardize the inputs to the various pages to enable features like
		code generation which can be helpful as applications grow.
	</BlogP>
	<BlogH2>Thank you</BlogH2>
	<BlogP>
		A big thank you to Richard Feldman for his original work on an <ExternalLink
			href="https://github.com/rtfeldman/elm-spa-example">Elm Spa example</ExternalLink
		>
		and to Dwayne Crooks for his recent example
		<ExternalLink
			href="https://discourse.elm-lang.org/t/announcing-dwayne-elm-conduit-a-replacement-for-rtfeldman-elm-spa-example/9758"
			>Dwayne's Conduit</ExternalLink
		>
	</BlogP>
	<BlogP>Have suggestions or comments? Please find me on X @mbryzek</BlogP>
</BlogPost>
