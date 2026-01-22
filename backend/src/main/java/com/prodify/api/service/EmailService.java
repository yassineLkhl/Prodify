package com.prodify.api.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.from-name}")
    private String fromName;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    /**
     * Envoie un email de bienvenue au nouvel utilisateur
     * @param to Adresse email du destinataire
     * @param firstName Prénom de l'utilisateur
     */
    @Async
    public void sendWelcomeEmail(String to, String firstName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject("Bienvenue sur Prodify ! 🎵");

            String htmlContent = buildWelcomeEmailHtml(firstName);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email de bienvenue envoyé à : {}", to);

        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email de bienvenue à {} : {}", to, e.getMessage(), e);
        }
    }

    /**
     * Envoie une confirmation de commande
     * @param to Adresse email du destinataire
     * @param amount Montant de la commande
     * @param orderId ID de la commande
     */
    @Async
    public void sendOrderConfirmation(String to, BigDecimal amount, UUID orderId) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject("Confirmation de commande #" + orderId.toString().substring(0, 8).toUpperCase());

            String htmlContent = buildOrderConfirmationEmailHtml(amount, orderId);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email de confirmation de commande envoyé à : {}", to);

        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email de confirmation à {} : {}", to, e.getMessage(), e);
        }
    }

    /**
     * Construit le contenu HTML de l'email de bienvenue
     */
    private String buildWelcomeEmailHtml(String firstName) {
        return "<!DOCTYPE html>\n"
                + "<html>\n"
                + "<head>\n"
                + "    <meta charset=\"UTF-8\">\n"
                + "    <style>\n"
                + "        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }\n"
                + "        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }\n"
                + "        .email-body { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }\n"
                + "        .header { color: #2563eb; font-size: 28px; font-weight: bold; margin-bottom: 20px; }\n"
                + "        .content { color: #555; font-size: 16px; line-height: 1.8; margin-bottom: 20px; }\n"
                + "        .cta-button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 20px 0; }\n"
                + "        .footer { color: #999; font-size: 12px; border-top: 1px solid #eee; margin-top: 20px; padding-top: 20px; }\n"
                + "    </style>\n"
                + "</head>\n"
                + "<body>\n"
                + "    <div class=\"container\">\n"
                + "        <div class=\"email-body\">\n"
                + "            <div class=\"header\">Bienvenue sur Prodify, " + firstName + "!</div>\n"
                + "            <div class=\"content\">\n"
                + "                <p>Merci d'avoir cree un compte sur <strong>Prodify</strong>, la plateforme de vente d'instrumentales musicales.</p>\n"
                + "                <p>Ton compte est pret a etre utilise. Voici ce que tu peux faire des maintenant :</p>\n"
                + "                <ul>\n"
                + "                    <li><strong>Explorer le catalogue</strong> : Decouvre des milliers d'instrumentales creees par les meilleurs producteurs.</li>\n"
                + "                    <li><strong>Acheter des beats</strong> : Ajoute des tracks a ton panier et paye en toute securite.</li>\n"
                + "                    <li><strong>Devenir producteur</strong> : Si tu es un producteur, cree ton profil et publie tes instrumentales.</li>\n"
                + "                </ul>\n"
                + "                <p>Des questions ? N'hesite pas a nous contacter via notre plateforme.</p>\n"
                + "            </div>\n"
                + "            <a href=\"" + frontendUrl + "\" class=\"cta-button\">Acceder a Prodify</a>\n"
                + "            <div class=\"footer\">\n"
                + "                <p>(c) Prodify - Tous droits reserves</p>\n"
                + "                <p>Si tu n'as pas cree ce compte, ignores cet email.</p>\n"
                + "            </div>\n"
                + "        </div>\n"
                + "    </div>\n"
                + "</body>\n"
                + "</html>";
    }

    /**
     * Construit le contenu HTML de l'email de confirmation de commande
     */
    private String buildOrderConfirmationEmailHtml(BigDecimal amount, UUID orderId) {
        String orderNum = orderId.toString().substring(0, 8).toUpperCase();
        String amountFormatted = amount.setScale(2, java.math.RoundingMode.HALF_UP).toString();
        
        return "<!DOCTYPE html>\n"
                + "<html>\n"
                + "<head>\n"
                + "    <meta charset=\"UTF-8\">\n"
                + "    <style>\n"
                + "        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }\n"
                + "        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }\n"
                + "        .email-body { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }\n"
                + "        .header { color: #16a34a; font-size: 28px; font-weight: bold; margin-bottom: 20px; }\n"
                + "        .content { color: #555; font-size: 16px; line-height: 1.8; margin-bottom: 20px; }\n"
                + "        .order-info { background: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2563eb; }\n"
                + "        .order-info p { margin: 10px 0; }\n"
                + "        .order-id { font-size: 14px; color: #999; }\n"
                + "        .amount { font-size: 24px; font-weight: bold; color: #16a34a; }\n"
                + "        .cta-button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 20px 0; }\n"
                + "        .footer { color: #999; font-size: 12px; border-top: 1px solid #eee; margin-top: 20px; padding-top: 20px; }\n"
                + "    </style>\n"
                + "</head>\n"
                + "<body>\n"
                + "    <div class=\"container\">\n"
                + "        <div class=\"email-body\">\n"
                + "            <div class=\"header\">Commande confirmee</div>\n"
                + "            <div class=\"content\">\n"
                + "                <p>Merci pour ton achat ! Nous avons bien recu ta commande.</p>\n"
                + "                <div class=\"order-info\">\n"
                + "                    <p class=\"order-id\">Numero de commande</p>\n"
                + "                    <p>#<strong>" + orderNum + "</strong></p>\n"
                + "                    <p style=\"margin-top: 15px;\">Montant paye</p>\n"
                + "                    <p class=\"amount\">" + amountFormatted + " EUR</p>\n"
                + "                </div>\n"
                + "                <p>Tes instrumentales sont maintenant disponibles dans ta bibliotheque. Tu peux les telecharger et les utiliser immediatement.</p>\n"
                + "                <p>Merci de ton soutien ! Nous esperons que tu apprecies les beats que tu as achetes.</p>\n"
                + "            </div>\n"
                + "            <a href=\"" + frontendUrl + "/library\" class=\"cta-button\">Acceder a ma bibliotheque</a>\n"
                + "            <div class=\"footer\">\n"
                + "                <p>(c) Prodify - Tous droits reserves</p>\n"
                + "                <p>Questions ? Contacte notre support via la plateforme.</p>\n"
                + "            </div>\n"
                + "        </div>\n"
                + "    </div>\n"
                + "</body>\n"
                + "</html>";
    }
}
