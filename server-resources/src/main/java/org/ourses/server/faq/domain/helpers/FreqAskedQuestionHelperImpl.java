package org.ourses.server.faq.domain.helpers;

import java.util.List;

import org.ourses.server.faq.domain.dto.FreqAskedQuestionDTO;
import org.ourses.server.faq.domain.entities.FreqAskedQuestion;
import org.springframework.stereotype.Component;

import com.google.common.base.Function;
import com.google.common.collect.Lists;

@Component
public class FreqAskedQuestionHelperImpl implements FreqAskedQuestionHelper {

    @Override
    public List<FreqAskedQuestionDTO> findAllFaq() {
        List<FreqAskedQuestion> faq = FreqAskedQuestion.findAll();
        return Lists.transform(faq, new Function<FreqAskedQuestion, FreqAskedQuestionDTO>() {

            @Override
            public FreqAskedQuestionDTO apply(final FreqAskedQuestion faq) {
                return faq.toFreqAskedQuestionDTO();
            }
        });
    }

    @Override
    public List<FreqAskedQuestionDTO> updateFaq(final List<FreqAskedQuestionDTO> faqsDto) {
        List<FreqAskedQuestion> faqs = FreqAskedQuestion.findAll();
        for (FreqAskedQuestion faq : faqs) {
            faq.delete();
        }
        for (FreqAskedQuestionDTO dto : faqsDto) {
            dto.toFreqAskedQuestion().save();
        }
        return faqsDto;
    }

}
