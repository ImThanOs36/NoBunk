export default {
	async scheduled(event, env, ctx) {
		try {
			console.log(`Worker ran at: ${new Date().toISOString()}`);
			
			const now = new Date();
			const isFirstDayOfMonth = now.getDate() === 1;
			const isSunday = now.getDay() === 0;
			
			// Get the Excel data from your backend API
			const response = await fetch('https://nobunk-backend.vercel.app/admin/attendance/export', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Failed to fetch Excel data');
			}

			const excelBuffer = await response.arrayBuffer();
			const excelData = Buffer.from(excelBuffer).toString('base64');
			
			// Prepare email content based on the current date
			const emailsToSend = [];

			// Daily report
			emailsToSend.push({
				subject: `Daily Attendance Report - ${now.toLocaleDateString()}`,
				content: 'Please find attached the daily attendance report.'
			});

			// Weekly report (if it's Sunday)
			if (isSunday) {
				emailsToSend.push({
					subject: `Weekly Attendance Report - Week ${getWeekNumber()}`,
					content: 'Please find attached the weekly attendance report.'
				});
			}

			// Monthly report (if it's the first day of the month)
			if (isFirstDayOfMonth) {
				emailsToSend.push({
					subject: `Monthly Attendance Report - ${now.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
					content: 'Please find attached the monthly attendance report.'
				});
			}

			// Send all applicable reports
			for (const email of emailsToSend) {
				const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						personalizations: [{
							to: [{ email: env.ADMIN_EMAIL }]
						}],
						from: { email: env.FROM_EMAIL },
						subject: email.subject,
						content: [{
							type: 'text/plain',
							value: email.content
						}],
						attachments: [{
							content: excelData,
							filename: `attendance_report_${now.toISOString().split('T')[0]}.xlsx`,
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
							disposition: 'attachment'
						}]
					})
				});

				if (!emailResponse.ok) {
					const errorText = await emailResponse.text();
					throw new Error(`Failed to send email: ${errorText}`);
				}

				console.log(`Email sent successfully: ${email.subject}`);
			}
		} catch (error) {
			console.error('Error in scheduled task:', error);
		}
	},

	async fetch(request, env) {
		return new Response("Attendance Report Automation Worker is running!");
	}
};

function getWeekNumber() {
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 1);
	const diff = now - start;
	const oneWeek = 1000 * 60 * 60 * 24 * 7;
	return Math.ceil(diff / oneWeek);
} 