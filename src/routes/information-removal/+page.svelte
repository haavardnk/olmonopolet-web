<svelte:head>
	<title>Information Removal Request</title>
</svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-12">
	<h1 class="text-3xl font-bold mb-4">Information Removal Request</h1>
	<p class="mb-6 opacity-80">
		Use this form to request removal of your personal information from Ølmonopolet. Please provide
		your email and a message describing what you want removed.
	</p>
	<form
		id="fs-frm"
		name="simple-contact-form"
		action="https://formspree.io/f/mqkraeok"
		method="post"
	>
		<fieldset id="fs-frm-inputs">
			<label for="email-address">Email Address</label>
			<input
				type="email"
				name="_replyto"
				id="email-address"
				placeholder="email@domain.tld"
				required
			/>
			<label for="message">Message</label>
			<textarea
				rows="5"
				name="message"
				id="message"
				placeholder="Please state what information you want to have removed."
				required
			></textarea>
			<input type="hidden" name="_subject" id="email-subject" value="Contact Form Submission" />
		</fieldset>
		<input type="submit" value="Submit" class="gh-btn gh-primary-btn" />
	</form>
	<style>
		/* reset */
		#fs-frm input,
		#fs-frm select,
		#fs-frm textarea,
		#fs-frm fieldset,
		#fs-frm optgroup,
		#fs-frm label,
		#fs-frm #card-element:disabled {
			font-family: inherit;
			font-size: 100%;
			color: inherit;
			border: none;
			border-radius: 0;
			display: block;
			width: 100%;
			padding: 0;
			margin: 0;
			-webkit-appearance: none;
			-moz-appearance: none;
		}

		#fs-frm input,
		#fs-frm textarea {
			color: black;
		}

		#fs-frm label,
		#fs-frm legend,
		#fs-frm ::placeholder {
			margin-bottom: 0.5rem;
			padding-top: 0.2rem;
			display: flex;
			align-items: baseline;
		}

		#fs-frm input,
		#fs-frm select,
		#fs-frm textarea,
		#fs-frm #card-element {
			border: 1px solid rgba(0, 0, 0, 0.2);
			background-color: rgba(255, 255, 255, 0.9);
			padding: 0.75em 1rem;
			margin-bottom: 1.5rem;
		}
		#fs-frm input:focus,
		#fs-frm select:focus,
		#fs-frm textarea:focus {
			background-color: white;
			outline-style: solid;
			outline-width: thin;
			outline-color: gray;
			outline-offset: -1px;
		}
		#fs-frm [type='text'],
		#fs-frm [type='email'] {
			width: 100%;
		}
		#fs-frm [type='button'],
		#fs-frm [type='submit'],
		#fs-frm [type='reset'] {
			width: auto;
			cursor: pointer;
			-webkit-appearance: button;
			-moz-appearance: button;
			appearance: button;
		}
		#fs-frm [type='button']:focus,
		#fs-frm [type='submit']:focus,
		#fs-frm [type='reset']:focus {
			outline: none;
		}
		#fs-frm [type='submit'],
		#fs-frm [type='reset'] {
			margin-bottom: 0;
			color: black;
		}
		#fs-frm select {
			text-transform: none;
		}

		#fs-frm [type='checkbox'] {
			-webkit-appearance: checkbox;
			-moz-appearance: checkbox;
			appearance: checkbox;
			display: inline-block;
			width: auto;
			margin: 0 0.5em 0 0 !important;
		}

		#fs-frm [type='radio'] {
			-webkit-appearance: radio;
			-moz-appearance: radio;
			appearance: radio;
		}

		/* address, locale */
		#fs-frm fieldset.locale input[name='city'],
		#fs-frm fieldset.locale select[name='state'],
		#fs-frm fieldset.locale input[name='postal-code'] {
			display: inline;
		}
		#fs-frm fieldset.locale input[name='city'] {
			width: 52%;
		}
		#fs-frm fieldset.locale select[name='state'],
		#fs-frm fieldset.locale input[name='postal-code'] {
			width: 20%;
		}
		#fs-frm fieldset.locale input[name='city'],
		#fs-frm fieldset.locale select[name='state'] {
			margin-right: 3%;
		}
	</style>
</div>
