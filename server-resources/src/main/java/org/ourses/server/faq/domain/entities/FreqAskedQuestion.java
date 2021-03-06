package org.ourses.server.faq.domain.entities;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.ourses.server.faq.domain.dto.FreqAskedQuestionDTO;
import org.springframework.beans.BeanUtils;

import com.avaje.ebean.Ebean;

@Entity
public class FreqAskedQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "faq_seq_gen")
    @SequenceGenerator(name = "faq_seq_gen", sequenceName = "faq_seq")
    private Long id;
    private String question;
    private String answer;
    private int questionOrder;

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

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

    public int getQuestionOrder() {
        return questionOrder;
    }

    public void setQuestionOrder(final int questionOrder) {
        this.questionOrder = questionOrder;
    }

    public static List<FreqAskedQuestion> findAll() {
        return Ebean.find(FreqAskedQuestion.class).orderBy().asc("questionOrder").findList();
    }

    public void delete() {
        Ebean.delete(this);
    }

    public void save() {
        Ebean.save(this);
    }

    public FreqAskedQuestionDTO toFreqAskedQuestionDTO() {
        FreqAskedQuestionDTO dto = new FreqAskedQuestionDTO();
        BeanUtils.copyProperties(this, dto);
        return dto;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

}
