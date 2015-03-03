package org.ourses.server.faq.domain.dto;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.ourses.server.faq.domain.entities.FreqAskedQuestion;
import org.springframework.beans.BeanUtils;

@JsonIgnoreProperties(ignoreUnknown = true)
public class FreqAskedQuestionDTO {

    private String question;
    private String answer;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(final String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(final String answer) {
        this.answer = answer;
    }

    public FreqAskedQuestion toFreqAskedQuestion() {
        FreqAskedQuestion freqAskedQuestion = new FreqAskedQuestion();
        BeanUtils.copyProperties(this, freqAskedQuestion);
        return freqAskedQuestion;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

}
