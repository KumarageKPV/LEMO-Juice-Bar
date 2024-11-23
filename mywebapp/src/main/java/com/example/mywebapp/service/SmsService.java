package com.example.mywebapp.service;

import com.vonage.client.VonageClient;
import com.vonage.client.sms.MessageStatus;
import com.vonage.client.sms.SmsSubmissionResponse;
import com.vonage.client.sms.messages.TextMessage;
import org.springframework.stereotype.Service;

@Service
public class SmsService {
    private VonageClient vonageClient;

    public SmsService(){
        this.vonageClient = VonageClient.builder()
                .apiKey("db5716cf")
                .apiSecret("HRS63RBjPCKQZ5nz")
                .build();
    }

    public String sendSms(String toPhoneNumber, String messageText) {
        TextMessage message = new TextMessage("Vonage APIs", toPhoneNumber, messageText);

        SmsSubmissionResponse response = vonageClient.getSmsClient().submitMessage(message);

        if (response.getMessages().get(0).getStatus() == MessageStatus.OK) {
            return "Message sent successfully.";
        } else {
            return "Message failed with error: " + response.getMessages().get(0).getErrorText();
        }
    }

}
