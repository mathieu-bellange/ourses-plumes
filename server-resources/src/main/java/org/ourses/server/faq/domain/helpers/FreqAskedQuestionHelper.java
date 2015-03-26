package org.ourses.server.faq.domain.helpers;

import java.util.List;

import org.ourses.server.faq.domain.dto.FreqAskedQuestionDTO;

public interface FreqAskedQuestionHelper {

    List<FreqAskedQuestionDTO> findAllFaq();

    List<FreqAskedQuestionDTO> updateFaq(List<FreqAskedQuestionDTO> faqs);

}
