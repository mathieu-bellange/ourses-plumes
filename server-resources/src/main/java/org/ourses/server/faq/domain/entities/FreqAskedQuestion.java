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
	@GeneratedValue(strategy = GenerationType.AUTO, generator = "faq_seq_gen")
	@SequenceGenerator(name = "faq_seq_gen", sequenceName = "faq_seq")
	private Long id;
	private String question;
	private String answer;
	private int questionOrder;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getQuestion() {
		return question;
	}
	public void setQuestion(String question) {
		this.question = question;
	}
	public String getAnswer() {
		return answer;
	}
	public void setAnswer(String answer) {
		this.answer = answer;
	}
	public int getQuestionOrder() {
		return questionOrder;
	}
	public void setQuestionOrder(int questionOrder) {
		this.questionOrder = questionOrder;
	}
	
	public static List<FreqAskedQuestion> findAll() {
		return Ebean.find(FreqAskedQuestion.class).orderBy().asc("questionOrder").findList();
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
