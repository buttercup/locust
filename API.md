## Classes

<dl>
<dt><a href="#LoginTarget">LoginTarget</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#_listenForUpdates">_listenForUpdates(type, input)</a></dt>
<dd><p>Attach an event listener to listen for input changes
Attaches listeners for username/password input changes and emits an event
when a change is detected.</p>
</dd>
<dt><a href="#getLoginTarget">getLoginTarget(queryEl)</a> ⇒ <code><a href="#LoginTarget">LoginTarget</a></code> | <code>null</code></dt>
<dd><p>Get the best login target on the current page</p>
</dd>
<dt><a href="#getLoginTargets">getLoginTargets(queryEl)</a> ⇒ <code><a href="#LoginTarget">Array.&lt;LoginTarget&gt;</a></code></dt>
<dd><p>Fetch all login targets
Fetches all detected login targets within some element (defaults to the current document).
Returned targets are not sorted or processed in any way that would indicate how likely
they are to be the &#39;correct&#39; login form for the page.</p>
</dd>
</dl>

<a name="LoginTarget"></a>

## LoginTarget
**Kind**: global class  

* [LoginTarget](#LoginTarget)
    * [new LoginTarget()](#new_LoginTarget_new)
    * [.forceSubmitDelay](#LoginTarget.forceSubmitDelay) : <code>Number</code>
    * [.form](#LoginTarget.form) : <code>HTMLFormElement</code>
    * [.passwordField](#LoginTarget.passwordField) : <code>HTMLInputElement</code> \| <code>null</code>
    * [.submitButton](#LoginTarget.submitButton) : <code>HTMLInputElement</code> \| <code>HTMLButtonElement</code> \| <code>null</code>
    * [.usernameField](#LoginTarget.usernameField) : <code>HTMLInputElement</code> \| <code>null</code>
    * [.calculateScore()](#LoginTarget.calculateScore) ⇒ <code>Number</code>
    * [.enterDetails(username, password)](#LoginTarget.enterDetails) ⇒ <code>Promise</code>
    * [.login(username, password, [force])](#LoginTarget.login) ⇒ <code>Promise</code>
    * [.submit([force])](#LoginTarget.submit)
    * [._waitForNoUnload()](#LoginTarget._waitForNoUnload) ⇒ <code>Promise</code>

<a name="new_LoginTarget_new"></a>

### new LoginTarget()
The LoginTarget class which represents a 'target' for logging in
with some credentials

<a name="LoginTarget.forceSubmitDelay"></a>

### LoginTarget.forceSubmitDelay : <code>Number</code>
Delay in milliseconds that the library should wait before force submitting the form

**Kind**: static property of [<code>LoginTarget</code>](#LoginTarget)  
<a name="LoginTarget.form"></a>

### LoginTarget.form : <code>HTMLFormElement</code>
The target login form

**Kind**: static property of [<code>LoginTarget</code>](#LoginTarget)  
<a name="LoginTarget.passwordField"></a>

### LoginTarget.passwordField : <code>HTMLInputElement</code> \| <code>null</code>
The password input element

**Kind**: static property of [<code>LoginTarget</code>](#LoginTarget)  
<a name="LoginTarget.submitButton"></a>

### LoginTarget.submitButton : <code>HTMLInputElement</code> \| <code>HTMLButtonElement</code> \| <code>null</code>
The submit button element

**Kind**: static property of [<code>LoginTarget</code>](#LoginTarget)  
<a name="LoginTarget.usernameField"></a>

### LoginTarget.usernameField : <code>HTMLInputElement</code> \| <code>null</code>
The username input element

**Kind**: static property of [<code>LoginTarget</code>](#LoginTarget)  
<a name="LoginTarget.calculateScore"></a>

### LoginTarget.calculateScore() ⇒ <code>Number</code>
Calculate the score of the login target
This can be used to compare LoginTargets by their likelihood of being
the correct login form. Higher number is better.

**Kind**: static method of [<code>LoginTarget</code>](#LoginTarget)  
**Returns**: <code>Number</code> - The calculated score  
<a name="LoginTarget.enterDetails"></a>

### LoginTarget.enterDetails(username, password) ⇒ <code>Promise</code>
Enter credentials into the form without logging in

**Kind**: static method of [<code>LoginTarget</code>](#LoginTarget)  
**Returns**: <code>Promise</code> - A promise that resolves once the data has been entered  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>String</code> | The username to enter |
| password | <code>String</code> | The password to enter |

**Example**  
```js
loginTarget.enterDetails("myUsername", "myPassword");
```
<a name="LoginTarget.login"></a>

### LoginTarget.login(username, password, [force]) ⇒ <code>Promise</code>
Login using the form
Enters the credentials into the form and logs in by either pressing the
login button or by submitting the form. The `force` option allows for
trying both methods: first by clicking the button and second by calling
`form.submit()`. When using `force=true`, if clicking the button doesn't
unload the page in `target.forceSubmitDelay` milliseconds,
`form.submit()` is called. If no form submit button is present, `force`
does nothing as `form.submit()` is called immediately.

**Kind**: static method of [<code>LoginTarget</code>](#LoginTarget)  
**Returns**: <code>Promise</code> - A promise that resolves once the login procedure has
completed. Let's be honest: there's probably no point to listen to the
return value of this function.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| username | <code>String</code> |  | The username to login with |
| password | <code>String</code> |  | The password to login with |
| [force] | <code>Boolean</code> | <code>false</code> | Whether or not to force the login (defaults to  false) |

**Example**  
```js
loginTarget.login("myUsername", "myPassword");
```
<a name="LoginTarget.submit"></a>

### LoginTarget.submit([force])
Submit the associated form
You probably don't want this function. `login` or `enterDetails` are way
better.

**Kind**: static method of [<code>LoginTarget</code>](#LoginTarget)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [force] | <code>Boolean</code> | <code>false</code> | Force the submission (defaults to false) |

<a name="LoginTarget._waitForNoUnload"></a>

### LoginTarget._waitForNoUnload() ⇒ <code>Promise</code>
Wait for either the unload event to fire or the delay to
time out

**Kind**: static method of [<code>LoginTarget</code>](#LoginTarget)  
**Returns**: <code>Promise</code> - A promise that resolves once either the delay has
expired for the page has begun unloading.  
**Access**: protected  
<a name="_listenForUpdates"></a>

## _listenForUpdates(type, input)
Attach an event listener to listen for input changes
Attaches listeners for username/password input changes and emits an event
when a change is detected.

**Kind**: global function  
**Emits**: <code>LoginTarget#event:valueChanged</code>, <code>LoginTarget#event:formSubmitted</code>  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | The type of input (username/password) |
| input | <code>HTMLInputElement</code> | The target input |

<a name="getLoginTarget"></a>

## getLoginTarget(queryEl) ⇒ [<code>LoginTarget</code>](#LoginTarget) \| <code>null</code>
Get the best login target on the current page

**Kind**: global function  
**Returns**: [<code>LoginTarget</code>](#LoginTarget) \| <code>null</code> - A login target or null of none found  
**See**: getLoginTargets  

| Param | Type | Description |
| --- | --- | --- |
| queryEl | <code>Document</code> \| <code>HTMLElement</code> | The element to query within |

<a name="getLoginTargets"></a>

## getLoginTargets(queryEl) ⇒ [<code>Array.&lt;LoginTarget&gt;</code>](#LoginTarget)
Fetch all login targets
Fetches all detected login targets within some element (defaults to the current document).
Returned targets are not sorted or processed in any way that would indicate how likely
they are to be the 'correct' login form for the page.

**Kind**: global function  
**Returns**: [<code>Array.&lt;LoginTarget&gt;</code>](#LoginTarget) - An array of login targets  

| Param | Type | Description |
| --- | --- | --- |
| queryEl | <code>Document</code> \| <code>HTMLElement</code> | The element to query within |

