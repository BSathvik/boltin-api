# boltin-api

boltin-api is an API for the [boltin](https://github.com/BSathvik/boltin) that helps with shortening Bitcoin Lightning network invoices (payment request).

## Endpoints

`/invoice/<key>` :
Is a `GET` request used to retreieve invoice data given a key (example: [wodzyIRs](https://boltin-api.bsat.workers.dev/invoice/wodzyIRs))

`/publish` :
Is a `POST` request used to submit the invoice
