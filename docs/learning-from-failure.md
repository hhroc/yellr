# Learning From Failure


### Mutation Events

The app is using HTML5 data attributes tohelp piece everything together on the JS side.

During development I had a thought.. "Can I call an event similar to onhashchange? So that when I change the data-state attribute it triggers a certain set of events?" Yes. And, no.

At least on the phone I was developing an app for. It works in modern browsers but not older browers. Thankfully I didn't spend too long on it/ I like it as a feature, but for now I guess we can make do without its convenience.





### Flexbox

Flexbox is awesome but as with all things awesome in CSS land not all browsers support it.

An easy way to deal with this is by taking advantage of the cascading effect of CSS. 

Let's set some simple rules
<h1>time keeps on slippin'</h1>
h1 {
	background: tomato;
	color: #ebebeb;
}
[render]

Now change something, but don't delete anything. Simply write it after, at the end.

h1 {
	background: tomato;
	background: skyblue;
	color: #ebebeb;
}
[it's blue]

Following this idea we have a simple solution. 
<header>
	<h1>Title</h1>
	<nav>
		<a href="#">Home</a>
		<a href="#">Articles</a>
		<a href="#">Login</a>
	</nav>
</header>
header {
	display: flexbox;	
}
h1 {
	width: 25%
	flex: 1;
}
nav {
	width: 75%;
	flex: 3;
}

Note: For this to work the item you're flexing should have a display of block. If it is set to anything else like inline-block, it won't work right.

display: block; // if this is set to display: inline-block it doesn't work right
width: 35%;
display: flex; // this overrides the display: block above.
flex: 3				 // a browser will disregard flex rules if it doesn't support it

