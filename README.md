# PGrade
Students in Ms. Pearson's class take tests on GradeCam -- but because the school district is cheap, there's no way for students to view their answers after tests are graded! PGrade provides a simple solution to this, allowing test results to be securely viewed online with minimal effort on the part of the teacher.

## Deployment
Deploying this system requires a Google Firebase project upgraded to "Blaze" status (it won't cost any money -- it just requires a connection to an outside authentication provider). Your school must also use the Synergy SIS platform with StudentVUE enabled. This system is designed to work with Gradecam Standard Scan Reports, but any other testing system that outputs in this format (see `sample_data.csv`) will work. Items to switch in code to customize deployment:
- Authentication email in `admin.html`
- Synergy SIS login endpoint in `functions/index.js`
- Project name in `.firebaserc`

Enjoy!
